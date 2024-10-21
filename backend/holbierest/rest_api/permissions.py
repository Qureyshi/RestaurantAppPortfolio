from rest_framework import permissions


class IsManagerMemberOrAdmin(permissions.BasePermission):

    def has_permission(self, request, view):
                           
        if request.user and request.user.is_superuser:
            return True
        
        if request.user and request.user.groups.filter(name="Manager").exists():
            return True
        
class IsDeliveryCrew(permissions.BasePermission):

    def has_permission(self, request, view):
        
        if request.user and request.user.groups.filter(name="Delivery crew").exists():
            return True
