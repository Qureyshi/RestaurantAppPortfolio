from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Category, MenuItem, Cart, Order, OrderItem, Reservation, Review
from .paginations import CustomPagination
from .permissions import IsManagerMemberOrAdmin
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import CategorySerializer, MenuItemSerializer, CartSerializer, OrderSerializer, CustomUserSerializer, ReservationSerializer, ReviewSerializer
from rest_framework.response import Response

from rest_framework.permissions import IsAdminUser
from django.shortcuts import  get_object_or_404
from django.utils import timezone

from django.contrib.auth.models import Group, User

from rest_framework import viewsets
from rest_framework import status


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
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category__title']  # Fields to filter on
    #pagination_class = CustomPagination
    search_fields = ['title', 'category__title']
    ordering_fields = ['price', 'title', 'category__title']

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
        elif self.request.user.groups.count()==0: #normal customer - no group
            return Order.objects.all().filter(user=self.request.user)
        elif self.request.user.groups.filter(name='Delivery Crew').exists(): #delivery crew
            return Order.objects.all().filter(delivery_crew=self.request.user)  #only show oreders assigned to him
        else: #delivery crew or manager
            return Order.objects.all()
        # else:
        #     return Order.objects.all()

    def create(self, request, *args, **kwargs):
        menuitem_count = Cart.objects.all().filter(user=self.request.user).count()
        if menuitem_count == 0:
            return Response({"message:": "no item in cart"})

        data = request.data.copy()
        total = self.get_total_price(self.request.user)
        data['total'] = total
        data['user'] = self.request.user.id
        data['date'] = timezone.now()  # Set the current date and time
        order_serializer = OrderSerializer(data=data, context={'request': request})
        
        if order_serializer.is_valid():
            order = order_serializer.save()

            items = Cart.objects.filter(user=self.request.user)
            for item in items:
                OrderItem.objects.create(
                    order=order,
                    menuitem=item.menuitem,
                    price=item.price,
                    quantity=item.quantity
                )

            # Clear the cart after creating the order
            items.delete()

            result = order_serializer.data
            result['total'] = total
            return Response(result, status=status.HTTP_201_CREATED)

        # If the serializer is not valid, return an error response
        return Response(order_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get_total_price(self, user):
        total = 0
        items = Cart.objects.all().filter(user=user).all()
        for item in items.values():
            total += item['price']
        return total


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

        # Update the order status if provided
        new_status = request.data.get('status')
        if new_status is not None:
            order.status = new_status

        # Assign delivery crew if provided
        delivery_crew_id = request.data.get('delivery_crew')
        
        if delivery_crew_id is not None:
            try:
                delivery_crew = User.objects.get(id=int(delivery_crew_id), groups__name='Delivery Crew')               
                order.delivery_crew = delivery_crew
            except User.DoesNotExist:                
                return Response({'error': 'Invalid delivery crew ID.'}, status=status.HTTP_400_BAD_REQUEST)

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