from django.db import models

# Create your models here.

class SchoolClass(models.Model):
    name = models.CharField(max_length=100)
    
    
    def __str__(self):
        return self.name
    
    
class Section(models.Model):
    name = models.CharField(max_length=100)
    school_class = models.ForeignKey(SchoolClass, on_delete=models.CASCADE, related_name='sections')
    
    def __str__(self):
        return f"{self.school_class.name} - {self.name}"
    
    
    
class Subject(models.Model):
    name = models.CharField(max_length=100)
    school_class = models.ForeignKey(SchoolClass, on_delete=models.CASCADE, related_name='subjects')
    
    def __str__(self):
        return self.name