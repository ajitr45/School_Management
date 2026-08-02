from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from .models import User 
from .serializers import UserSerializer   

# Create your views here.

class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    
    
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import LoginSerializer
from .services import login_user


class LoginAPIView(APIView):

    def post(self, request):

        serializer = LoginSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        data = login_user(serializer.validated_data)

        return Response(
            data,
            status=status.HTTP_200_OK
        )