from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password

from .models import User


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "password",
            "role",
        ]

        read_only_fields = ["id"]

        # Password is hidden in responses and password strength is validated
        extra_kwargs = {
            "password": {
                "write_only": True,
                "validators": [validate_password],
            }
        }

    def create(self, validated_data):

        # Extract the password so create_user() can hash it securely
        password = validated_data.pop("password")

        user = User.objects.create_user(password=password, **validated_data)

        return user


class LoginSerializer(serializers.Serializer):

    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True)


class LogoutSerializer(serializers.Serializer):

    refresh = serializers.CharField()


class ChangePasswordSerializer(serializers.Serializer):

    old_password = serializers.CharField(write_only=True)

    new_password = serializers.CharField(
        write_only=True,
        validators=[validate_password]
    )

    confirm_password = serializers.CharField(write_only=True)

    # Make sure the new password and confirmation password match
    def validate(self, attrs):

        if attrs["new_password"] != attrs["confirm_password"]:
            raise serializers.ValidationError({
                "confirm_password": "Passwords do not match."
            })

        return attrs


class ForgotPasswordSerializer(serializers.Serializer):

    email = serializers.EmailField()


class VerifyOTPSerializer(serializers.Serializer):

    email = serializers.EmailField() 
    otp = serializers.CharField(max_length=6, min_length=6)


class ResetPasswordSerializer(serializers.Serializer):

    email = serializers.EmailField()
    otp = serializers.CharField( max_length=6, min_length=6)

    new_password = serializers.CharField(
        write_only=True,
        validators=[validate_password]
    )

    confirm_password = serializers.CharField(write_only=True)

    # Make sure the new password and confirmation password match
    def validate(self, attrs):

        if attrs["new_password"] != attrs["confirm_password"]:
            raise serializers.ValidationError({
                "confirm_password": "Passwords do not match."
            })

        return attrs


class ProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = User

        fields = [
            "id",
            "username",
            "email",
            "role",
        ]

        read_only_fields = [
            "id",
            "username",
            "email",
            "role",
        ]