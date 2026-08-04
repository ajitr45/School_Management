from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken    
from rest_framework.exceptions import ValidationError as validationError

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
    

def logout_user(validated_data):
    
    refresh_token = validated_data["refresh"]
    token = RefreshToken(refresh_token)
    token.blacklist()
    
    return { "message": "Logout successful."}



def change_password(user, validated_data):
    
    old_password = validated_data["old_password"]
    new_password = validated_data["new_password"]
    confirm_password = validated_data["confirm_password"]
    
    if not user.check_password(old_password):
        raise validationError(
            {
                "old_password": "Old password is incorrect."
            }
        )
    
    if new_password != confirm_password:
        raise validationError(
            {
                "new_password": "New password and confirm password do not match."
            }
        )
        
    #set new password    
    user.set_password(new_password)
    
    user.save()
    
    return { "message": "Password changed successfully."}