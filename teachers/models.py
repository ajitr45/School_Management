from django.db import models
from accounts.models import User
from academics.models import SchoolClass, Section, Subject

# Create your models here.

class Teacher(models.Model):
    
    GENDER_CHOICES = (
        ('MALE', 'Male'),
        ('FEMALE', 'Female'),
        ('OTHER', 'Other'),
    )

    user = models.OneToOneField( User,on_delete=models.CASCADE)
    teacher_id = models.CharField(max_length=20,unique=True)
    full_name = models.CharField(max_length=100)
    mobile = models.CharField(max_length=15,unique=True)
    qualification = models.CharField(max_length=100)
    experience = models.PositiveIntegerField(default=0, help_text="Experience in years")
    date_of_birth = models.DateField(blank=True, null=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    address = models.TextField(blank=True, null=True)
    photo = models.ImageField(upload_to='teacher_photos/', blank=True, null=True)
    joining_date = models.DateField( ) 
    

    def __str__(self):
        return self.teacher_id
    
    
class TeacherAssignment(models.Model):

    teacher = models.ForeignKey( Teacher,on_delete=models.CASCADE , related_name='assignments')

    school_class = models.ForeignKey( SchoolClass,on_delete=models.CASCADE)

    section = models.ForeignKey( Section,on_delete=models.CASCADE)

    subject = models.ForeignKey( Subject,on_delete=models.CASCADE)
    
    
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['teacher', 'school_class', 'section', 'subject'],
                name='unique_teacher_assignment'
            )
        ]

    def __str__(self):
        return (
                f"{self.teacher.teacher_id} | "
                f"{self.school_class.name}-{self.section.name} | "
                f"{self.subject.name}"
                )