from django.db import models
from academics.models import SchoolClass
import uuid

# Create your models here.

def generate_application_no():
    return "Application_No-" + str(uuid.uuid4())[:8].upper()  

class Admission(models.Model):
   

    GENDER_CHOICES = [
        ('MALE', 'Male'),
        ('FEMALE', 'Female'),
        ('OTHER', 'Other'),
    ]
    
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    ]
    
    application_no = models.CharField(max_length=20, unique=True, blank=True, default=generate_application_no)
    student_name = models.CharField(max_length=100)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    blood_group = models.CharField(max_length=5, blank=True, null=True)
    student_photo = models.ImageField(upload_to='student_photos/', blank=True, null=True)
    academic_year = models.CharField(max_length=20)
    applying_class = models.ForeignKey(SchoolClass, on_delete=models.CASCADE)
    previous_school = models.CharField(max_length=100, blank=True, null=True)
    
    #guardian information
    
    father_name = models.CharField(max_length=50)
    father_occupation = models.CharField(max_length=50, blank=True, null=True)
    mother_name = models.CharField(max_length=50)
    mother_occupation = models.CharField(max_length=50, blank=True, null=True)
    guardian_mobile = models.CharField(max_length=15, blank=True, null=True)
    guardian_email = models.EmailField(blank=True, null=True)

    #Address information
    Address_line1 = models.CharField(max_length=100)
    Address_line2 = models.CharField(max_length=100, blank=True, null=True)
    city = models.CharField(max_length=50)
    state = models.CharField(max_length=50)
    pin_code = models.CharField(max_length=10)
    
    #Documents
    birth_certificate = models.FileField(upload_to='birth_certificates/', blank=True, null=True)
    transfer_certificate = models.FileField(upload_to='transfer_certificates/', blank=True, null=True)
    marksheet = models.FileField(upload_to='marksheets/', blank=True, null=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')
    applied_date = models.DateTimeField(auto_now_add=True)
    
    
    
    def __str__(self):
        return (f"{self.application_no} - {self.student_name}")

    