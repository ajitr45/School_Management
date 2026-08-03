from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, LoginAPIView,LogoutAPIView


router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')



urlpatterns = [
    
    path('', include(router.urls)),
    path("login/", LoginAPIView.as_view(), name="login"),
    path("logout/", LogoutAPIView.as_view(), name="logout"),
]