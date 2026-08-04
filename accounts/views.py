from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from .models import User 
from .serializers import UserSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import LoginSerializer, LogoutSerializer, ChangePasswordSerializer
from .services import login_user,logout_user, change_password
from rest_framework.permissions import IsAuthenticated


class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    

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