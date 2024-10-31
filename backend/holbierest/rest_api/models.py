from django.db import models
from django.contrib.auth.models import User


class Category(models.Model):
    slug = models.SlugField()
    title = models.CharField(max_length=255, db_index=True)
    
    def __str__(self):
        return self.title


class MenuItem(models.Model):
    title = models.CharField(max_length=255, db_index=True)
    price = models.DecimalField(max_digits=6, decimal_places=2, db_index=True)
    featured = models.BooleanField(db_index=True)
    category = models.ForeignKey(Category, on_delete=models.PROTECT)
    image = models.ImageField(upload_to='menu_images/', default='default_image.jpg')
    
    class Meta:
        ordering = ['category']
        
    def __str__(self):
        return self.title
    

class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE, related_name='reviews')
    rating = models.PositiveIntegerField(choices=[(i, i) for i in range(1, 6)])  # Rating from 1 to 5
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Review for {self.menu_item} by {self.user}'


class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    menuitem = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    quantity = models.SmallIntegerField()
    unit_price = models.DecimalField(max_digits=6, decimal_places=2)
    price = models.DecimalField(max_digits=6, decimal_places=2)

    class Meta:
        unique_together = ('menuitem', 'user')
        
    def __str__(self):
        return f'{self.menuitem.title} - user: {self.user.username}'


class Order(models.Model):
    STATUS_CHOICES = [
        ('READY', 'Ready'),
        ('DELIVERED', 'Delivered'),
        ('PENDING', 'Pending'),
        ('CANCELLED', 'Cancelled'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    delivery_crew = models.ForeignKey(
        User, on_delete=models.SET_NULL, related_name="delivery_crew", null=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')
    total = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    date = models.DateTimeField(auto_now_add=True)  # Use DateTimeField
    
    def __str__(self):
        return f'username:{self.user.username} order_id{self.id}'


class OrderItem(models.Model):
    order = models.ForeignKey(
        Order, on_delete=models.CASCADE, related_name='order')
    menuitem = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    quantity = models.SmallIntegerField()
    price = models.DecimalField(max_digits=6, decimal_places=2)

    class Meta:
        unique_together = ('order', 'menuitem')
    
    def __str__(self):
        return f'{self.menuitem.title} - order_id:{self.order}'
    
    from django.db import models

class Reservation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, related_name='reservations')
    date = models.DateField()
    time = models.TimeField()
    phone_number = models.CharField(max_length=15)
    number_of_guests = models.PositiveIntegerField()
    message = models.TextField(blank=True)

    def __str__(self):
        return f"Reservation on {self.date} at {self.time} for {self.number_of_guests} guests"
