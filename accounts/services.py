from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken    


def login_user(validated_data):

    username = validated_data["username"]
    password = validated_data["password"]

    user = authenticate(username=username, password=password,)

    if user is None:
        raise AuthenticationFailed(
            "Invalid username or password."
        )

    refresh = RefreshToken.for_user(user)

    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role,
        },
    }