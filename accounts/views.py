from django.shortcuts import render
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.viewsets import ModelViewSet
from .models import User 
from .serializers import ForgotPasswordSerializer, ResetPasswordSerializer, UserSerializer, VerifyOTPSerializer, ProfileSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import LoginSerializer, LogoutSerializer, ChangePasswordSerializer
from .services import forgot_password, get_profile, login_user,logout_user, change_password, reset_password, verify_otp
from rest_framework.permissions import IsAuthenticated
from accounts.permissions import IsAdmin


class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]
    
    

class LoginAPIView(APIView):

    def post(self, request):
        
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = login_user(serializer.validated_data)

        return Response( data, status=status.HTTP_200_OK)   


class LogoutAPIView(APIView):
    
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        
        serializer = LogoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = logout_user(serializer.validated_data)
        return Response(data, status=status.HTTP_200_OK)    
    

class ChangePasswordAPIView(APIView):
    
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = change_password(request.user, serializer.validated_data)
        return Response(data, status=status.HTTP_200_OK)
    
    
class ForgotPasswordAPIView(APIView):

    def post(self, request):

        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = forgot_password(serializer.validated_data)

        return Response(data, status=status.HTTP_200_OK)
    
class VerifyOTPAPIView(APIView):

    def post(self, request):

        serializer = VerifyOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = verify_otp(serializer.validated_data)

        return Response(data, status=status.HTTP_200_OK)
    
class ResetPasswordAPIView(APIView):

    def post(self, request):

        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = reset_password(serializer.validated_data)

        return Response(data, status=status.HTTP_200_OK)
    

class ProfileAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        
        user = get_profile(request.user)
        serializer = ProfileSerializer(user)
        
        return Response(serializer.data, status=status.HTTP_200_OK)