from django.contrib import admin
from .models import MenuItem, Category, Cart, OrderItem, Order, Reservation, Review, CustomUser, SiteSettings

admin.site.register(SiteSettings)
admin.site.register(CustomUser)
admin.site.register(MenuItem)
admin.site.register(Category)
admin.site.register(Cart)
admin.site.register(OrderItem)
admin.site.register(Order)
admin.site.register(Reservation)
admin.site.register(Review)