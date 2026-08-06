from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ForgotPasswordAPIView, ProfileAPIView, ResetPasswordAPIView, UserViewSet, LoginAPIView,LogoutAPIView, ChangePasswordAPIView, VerifyOTPAPIView


router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')



urlpatterns = [
    
    path('', include(router.urls)),
    path("login/", LoginAPIView.as_view(), name="login"),
    path("logout/", LogoutAPIView.as_view(), name="logout"),
    path("change-password/", ChangePasswordAPIView.as_view(), name="change-password"),
    path("forgot-password/", ForgotPasswordAPIView.as_view(), name="forgot-password"),
    path("verify-otp/", VerifyOTPAPIView.as_view(), name="verify-otp"),
    path("reset-password/", ResetPasswordAPIView.as_view(), name="reset-password"),
    path("profile/", ProfileAPIView.as_view(), name="profile"),
    
]