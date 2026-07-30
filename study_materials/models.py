from django.db import models
from academics.models import SchoolClass, Subject

# Create your models here.

class Chapter(models.Model):
    
    school_class = models.ForeignKey(SchoolClass, on_delete=models.CASCADE, related_name="chapters")
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name="chapters")
    chapter_number = models.PositiveIntegerField()
    name = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        
        ordering = [
            "school_class",
            "subject",
            "name",
        ]
        
    def __str__(self):
        return f"Chapter {self.chapter_number} - {self.name}"
    
    
class StudyMaterial(models.Model):
    
    chapter = models.ForeignKey(Chapter, on_delete=models.CASCADE, related_name="study_materials")
    description = models.TextField(blank=True)
    file = models.FileField(upload_to="study_materials/")
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        
        ordering = ["-created_at"]
        
        
    def __str__(self):
        return f"{self.chapter.name} - Material "