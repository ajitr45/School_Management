from django.db import models
from academics.models import SchoolClass, Subject, Section
from teachers.models import Teacher

# Create your models here.

class Homework(models.Model):
    
    school_class = models.ForeignKey(SchoolClass, on_delete=models.CASCADE, related_name="homeworks")
    section = models.ForeignKey(Section, on_delete=models.CASCADE, related_name="homeworks")
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name="homeworks")
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name="homeworks")
    title = models.CharField(max_length=200,)
    description = models.TextField()
    due_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        
        ordering = ["created_at", ]
        
        
        
    def __str__(self):
        return self.title        