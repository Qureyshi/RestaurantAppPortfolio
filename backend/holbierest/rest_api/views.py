from decimal import Decimal
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Category, MenuItem, Cart, Order, OrderItem, Reservation, Review, SiteSettings
from .permissions import IsManagerMemberOrAdmin
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.pagination import PageNumberPagination
from .filters import MenuItemFilter
from .serializers import CategorySerializer, MenuItemSerializer, CartSerializer, OrderSerializer, CustomUserSerializer, ReservationSerializer, ReviewSerializer
from rest_framework.response import Response

from rest_framework.permissions import IsAdminUser
from django.shortcuts import  get_object_or_404
from django.utils import timezone

from django.contrib.auth.models import Group
from django.contrib.auth import get_user_model

from rest_framework import viewsets
from rest_framework import status

# Get the custom user model
User = get_user_model()


class CategoriesView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_permissions(self):
        permission_classes = []
        if self.request.method != 'GET':
            permission_classes = [IsAuthenticated]

        return [permission() for permission in permission_classes]
    
class MenuItemsView(generics.ListCreateAPIView):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    pagination_class = PageNumberPagination  # Uses the global PAGE_SIZE
    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter
    ]
    search_fields = ['title', 'category__title']  # Search by these fields
    filterset_class = MenuItemFilter  # Custom filter for price range and category
    ordering_fields = ['price']  # Enables ordering by price

    def get_permissions(self):
        permission_classes = []
        if self.request.method != 'GET':
            permission_classes = [IsAuthenticated]

        return [permission() for permission in permission_classes]


class SingleMenuItemView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer

    def get_permissions(self):
        permission_classes = []
        if self.request.method != 'GET':
            permission_classes = [IsAuthenticated]

        return [permission() for permission in permission_classes]

class CartView(generics.ListCreateAPIView):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.all().filter(user=self.request.user)

    def post(self, request, *args, **kwargs):
        menuitem = get_object_or_404(MenuItem, id=request.data['menuitem_id'])
        # Set quantity to 1 if not provided in the request
        quantity = int(request.data.get('quantity', 1))
        cart_item, created = Cart.objects.get_or_create(
            user=self.request.user, menuitem=menuitem,
            defaults={'quantity': quantity, 'unit_price': menuitem.price, 'price': menuitem.price * quantity}
        )
        if not created:
            cart_item.quantity += quantity
            cart_item.price = cart_item.quantity * cart_item.unit_price
            cart_item.save()
            return Response({'message': 'Item already exists, quantity updated'}, status.HTTP_200_OK)

        return Response({'message': "Item added to Cart!"}, status.HTTP_201_CREATED)


    def delete(self, request, *args, **kwargs):
        Cart.objects.all().filter(user=self.request.user).delete()
        return Response("ok")
    
    # New method to handle PUT requests for updating quantity
class SingleCartItemView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer

    def get_permissions(self):
        permission_classes = []
        if self.request.method != 'GET':
            permission_classes = [IsAuthenticated]

        return [permission() for permission in permission_classes]
    
    def put(self, request, menuitem_id, *args, **kwargs):
        cart_item = get_object_or_404(Cart, user=self.request.user, menuitem__id=menuitem_id)
        new_quantity = int(request.data.get('quantity', cart_item.quantity))
        
        if new_quantity < 1:
            cart_item.delete()
            return Response({'message': 'Item removed from cart'}, status=status.HTTP_204_NO_CONTENT)
        
        cart_item.quantity = new_quantity
        cart_item.price = cart_item.unit_price * new_quantity
        cart_item.save()

        return Response(CartSerializer(cart_item).data, status=status.HTTP_200_OK)

    # New method to handle DELETE requests for a single cart item
    def delete(self, request, menuitem_id, *args, **kwargs):        
        cart_item = get_object_or_404(Cart, user=self.request.user, menuitem_id=menuitem_id)
        # Delete the cart item
        cart_item.delete()

        return Response({"message": "Cart item deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


class OrderView(generics.ListCreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_superuser:
            return Order.objects.all()
        elif self.request.user.groups.count() == 0:  # Normal customer - no group
            return Order.objects.filter(user=self.request.user)
        elif self.request.user.groups.filter(name='Delivery Crew').exists():  # Delivery crew
            return Order.objects.filter(delivery_crew=self.request.user)  # Show orders assigned to them
        else:  # Other roles, e.g., managers
            return Order.objects.all()

    def get_bonus_percentage(self):
        # Retrieve or create the SiteSettings instance
        settings, created = SiteSettings.objects.get_or_create(id=1, defaults={'bonus_percentage': Decimal('2.0')})
        return settings.bonus_percentage / Decimal('100')  # Convert to decimal percentage

    def create(self, request, *args, **kwargs):
        # Ensure the cart has items
        menuitem_count = Cart.objects.filter(user=self.request.user).count()
        if menuitem_count == 0:
            return Response({"message": "No items in cart"}, status=status.HTTP_400_BAD_REQUEST)

        data = request.data.copy()
        total = self.get_total_price(self.request.user)  # Get total price from the cart        
        data['total'] = total
        data['user'] = self.request.user.id
        data['date'] = timezone.now()  # Set the current date and time

        # Optional tip provided by the user
        tip = Decimal(request.data.get('tip', Decimal('0.0')))
        
        # Check if the user wants to use bonus
        bonus_used = Decimal(request.data.get('bonus_used', '0.0'))  # Bonus user wants to apply
        bonus_available = self.request.user.bonus_earned

        # Ensure bonus used is not more than the available bonus
        if bonus_used > bonus_available:
            return Response({"message": "Insufficient bonus balance."}, status=status.HTTP_400_BAD_REQUEST)

        # Apply the bonus to the total price
        total_after_bonus = total - bonus_used       
        if total_after_bonus < 0:
            total_after_bonus = Decimal('0.0')  # If bonus exceeds total, set total to 0
            bonus_used = total
        
        data['total_after_bonus'] = total_after_bonus  # Send the total after applying bonus

        order_serializer = OrderSerializer(data=data, context={'request': request})

        if order_serializer.is_valid():
            order = order_serializer.save()

            # Process items from the cart and save them to the OrderItem model
            items = Cart.objects.filter(user=self.request.user)
            for item in items:
                OrderItem.objects.create(
                    order=order,
                    menuitem=item.menuitem,
                    price=item.price,
                    quantity=item.quantity
                )

            # Clear the cart after the order is created
            items.delete()

            # Calculate and apply bonus for the user
            bonus_percentage = self.get_bonus_percentage()  # Retrieve bonus percentage
            bonus = total_after_bonus * bonus_percentage
            self.request.user.bonus_earned += bonus
            
            # Deduct the bonus from the user's bonus_earned balance
            self.request.user.bonus_earned -= bonus_used
            
            self.request.user.save()

            # Store the customer's tip in the user's profile
            if tip > Decimal('0.0'):
                self.request.user.tip += tip
                self.request.user.save()

            # Include updated bonus in response
            result = order_serializer.data
            result['total'] = total           
            result['bonus_used'] = bonus_used
            result['bonus_earned'] = self.request.user.bonus_earned  # Send updated bonus to client
            result['total_after_bonus'] = total_after_bonus  # Include total after bonus in the response
            result['tip'] = tip  # Send the tip (stored in the customer's field)
            return Response(result, status=status.HTTP_201_CREATED)

        # If the serializer is not valid, return the error response
        return Response(order_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_total_price(self, user):
        total = Decimal('0.0')  # Use Decimal for currency calculations
        items = Cart.objects.filter(user=user)
        
        for item in items:            
            total += item.price        
        return Decimal(total)


class SingleOrderView(generics.RetrieveUpdateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        # Check if the user belongs to a group or is a superuser
        if self.request.user.groups.count() == 0 and not self.request.user.is_superuser:
            return Response({'error': 'Not authorized to update order.'}, status=status.HTTP_403_FORBIDDEN)

        # Retrieve the order instance
        order = self.get_object()

        # Assign delivery crew if provided
        delivery_crew_id = request.data.get('delivery_crew')
        if delivery_crew_id is not None:
            try:
                # Check that the user is a valid delivery crew member
                delivery_crew = User.objects.get(id=int(delivery_crew_id), groups__name='Delivery Crew')
                order.delivery_crew = delivery_crew
            except User.DoesNotExist:
                return Response({'error': 'Invalid delivery crew ID.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the status is being updated
        new_status = request.data.get('status')
        if new_status is not None:
            # Update the status
            order.status = new_status

        # Trigger tip transfer if conditions are met
        if new_status in ['READY', 'DELIVERED']:
            if order.delivery_crew:  # Ensure a delivery crew is assigned
                if order.user.tip > Decimal('0.0'):  # Check if customer has a tip
                    # Transfer the tip
                    order.delivery_crew.tip += order.user.tip
                    order.user.tip = Decimal('0.0')  # Reset the customer's tip
                    order.user.save()
                    order.delivery_crew.save()
                else:
                    # Log or handle the case where no tip exists
                    print(f"Order {order.id} has no tip to transfer.")
            else:
                # Log or handle the case where no delivery crew is assigned
                print(f"Order {order.id} has no delivery crew assigned for tip transfer.")

        # Save the updated order
        order.save()

        # Serialize and return the updated order
        serializer = self.get_serializer(order)
        return Response(serializer.data, status=status.HTTP_200_OK)


class GroupViewSet(viewsets.ViewSet):
    permission_classes = [IsAdminUser]
    def list(self, request):
        users = User.objects.all().filter(groups__name='Manager')
        items = CustomUserSerializer(users, many=True)
        return Response(items.data)

    def create(self, request):
        user = get_object_or_404(User, username=request.data['username'])
        managers = Group.objects.get(name="Manager")
        managers.user_set.add(user)
        return Response({"message": "user added to the manager group"}, 200)

    def destroy(self, request):
        user = get_object_or_404(User, username=request.data['username'])
        managers = Group.objects.get(name="Manager")
        managers.user_set.remove(user)
        return Response({"message": "user removed from the manager group"}, 200)

class DeliveryCrewViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    def list(self, request):
        users = User.objects.all().filter(groups__name='Delivery Crew')
        items = CustomUserSerializer(users, many=True)
        return Response(items.data)

    def create(self, request):
        #only for super admin and managers
        if self.request.user.is_superuser == False:
            if self.request.user.groups.filter(name='Manager').exists() == False:
                return Response({"message":"forbidden"}, status.HTTP_403_FORBIDDEN)
        
        user = get_object_or_404(User, username=request.data['username'])
        dc = Group.objects.get(name="Delivery Crew")
        dc.user_set.add(user)
        return Response({"message": "user added to the delivery crew group"}, 200)

    def destroy(self, request):
        #only for super admin and managers
        if self.request.user.is_superuser == False:
            if self.request.user.groups.filter(name='Manager').exists() == False:
                return Response({"message":"forbidden"}, status.HTTP_403_FORBIDDEN)
        user = get_object_or_404(User, username=request.data['username'])
        dc = Group.objects.get(name="Delivery Crew")
        dc.user_set.remove(user)
        return Response({"message": "user removed from the delivery crew group"}, 200)
    

class ReservationListCreateView(generics.ListCreateAPIView):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    permission_classes = [IsAuthenticated]

    #def get_permissions(self):
    #    # Only allow listing all reservations for admin and manager users
    #    if self.request.method == 'GET':
    #        self.permission_classes = [IsAuthenticated, IsManagerMemberOrAdmin]
    #    return super().get_permissions()

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.groups.filter(name="Manager").exists():
            # Admins and Managers can see all reservations
            return Reservation.objects.all()
        else:
            # Regular users can only see their own reservations
            return Reservation.objects.filter(user=user)

    def perform_create(self, serializer):
        # Automatically associate the reservation with the logged-in user
        serializer.save(user=self.request.user)


class ReservationRetrieveUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    permission_classes = [IsAuthenticated, IsManagerMemberOrAdmin]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.groups.filter(name="Manager").exists():
            # Admins and Managers can access any reservation for updating
            return Reservation.objects.all()
        else:
            # Regular users shouldn't reach this view for updating
            return Reservation.objects.none()


class ReviewListCreateView(generics.ListCreateAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    
    def get_permissions(self):
        permission_classes = []
        if self.request.method != 'GET':
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        menu_item_id = self.kwargs['menu_item_id']
        return Review.objects.filter(menu_item_id=menu_item_id)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)