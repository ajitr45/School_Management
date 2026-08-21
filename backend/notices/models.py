from django.db import models
from academics.models import SchoolClass

# Create your models here.

class Notice(models.Model):
    
    AUDIENCE_CHOICES = [
        ("ALL", "All"),
        ("STUDENT", "Student"),
        ("TEACHER", "Teacher"),
        ("CLASS", "Class"),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    audience = models.CharField(max_length=20, choices=AUDIENCE_CHOICES)
    school_class = models.ForeignKey(SchoolClass, on_delete=models.CASCADE, null=True, blank=True)
    expiry_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        
        ordering = ["-created_at"]
        
        
    def __str__(self):
        return self.title

        