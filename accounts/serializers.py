from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ["id", "username", "email", "password", "role"]

        extra_kwargs = {
            "password": {"write_only": True}
        }

    def create(self, validated_data):

        user = User(
            username=validated_data["username"],
            email=validated_data["email"],
            role=validated_data["role"]
        )

        user.set_password(validated_data["password"])
        user.save()

        return user
    
class LoginSerializer(serializers.Serializer):

    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True)
    
    
class LogoutSerializer(serializers.Serializer):
    
    refresh = serializers.CharField()
    
    
class ChangePasswordSerializer(serializers.Serializer):
    
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    