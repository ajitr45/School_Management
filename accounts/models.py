from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from datetime import timedelta


# Create your models here.

class User(AbstractUser):
    
    ADMIN = "ADMIN"
    TEACHER = "TEACHER"
    STUDENT = "STUDENT"
    
    Role_CHOICES = (
        ('ADMIN', 'Admin'),
        ('TEACHER', 'Teacher'),
        ('STUDENT', 'Student'),
    )
    role = models.CharField(max_length=20, choices=Role_CHOICES)


def otp_expire():
    return timezone.now() + timedelta(minutes=5)

class PasswordResetOTP(models.Model):
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name = "password_reset_otps")
    otp = models.CharField(max_length=6)
    is_varified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(default=otp_expire)
    
    def __str__(self):
        return f"OTP for {self.user.username} - {self.otp}"