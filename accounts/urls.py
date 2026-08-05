from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ForgotPasswordAPIView, UserViewSet, LoginAPIView,LogoutAPIView, ChangePasswordAPIView


router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')



urlpatterns = [
    
    path('', include(router.urls)),
    path("login/", LoginAPIView.as_view(), name="login"),
    path("logout/", LogoutAPIView.as_view(), name="logout"),
    path("change-password/", ChangePasswordAPIView.as_view(), name="change-password"),
    path("forgot-password/", ForgotPasswordAPIView.as_view(), name="forgot-password"),
]