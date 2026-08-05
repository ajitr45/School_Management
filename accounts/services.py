from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed, ValidationError
from rest_framework_simplejwt.tokens import RefreshToken    
from rest_framework.exceptions import ValidationError as validationError
from .utils import generate_otp
from django.core.mail import send_mail
from django.conf import settings
from .models import PasswordResetOTP, User

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


def forgot_password(validated_data):

    email = validated_data["email"]

    # Check user
    user = User.objects.filter(email=email).first()

    if not user:
        raise ValidationError({
            "email": "User with this email does not exist."
        })

    # Delete previous OTP
    PasswordResetOTP.objects.filter(user=user).delete()

    # Generate OTP
    otp = generate_otp()

    # Save OTP
    PasswordResetOTP.objects.create(
        user=user,
        otp=otp,
    )

    # Send Email
    send_mail(
        subject="Password Reset OTP",
        message=f"Your OTP is {otp}. It is valid for 5 minutes.",
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[email],
        fail_silently=False,
    )

    return {"message": "OTP sent successfully.",}