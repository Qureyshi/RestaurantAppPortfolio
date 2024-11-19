from django_filters import rest_framework as filters
from .models import MenuItem

class MenuItemFilter(filters.FilterSet):
    price_min = filters.NumberFilter(field_name="price", lookup_expr="gte")
    price_max = filters.NumberFilter(field_name="price", lookup_expr="lte")

    class Meta:
        model = MenuItem
        fields = ['category', 'price']
