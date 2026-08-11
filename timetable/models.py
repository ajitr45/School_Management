from django.db import models
from academics.models import SchoolClass, Section, Subject
from teachers.models import Teacher

# Create your models here.

class Timetable(models.Model):
    
    DAYS = [
        ("MONDAY", "Monday"),
        ("TUESDAY", "Tuesday"),
        ("WEDNESDAY", "Wednesday"),
        ("THURSDAY", "Thursday"),
        ("FRIDAY", "Friday"),
        ("SATURDAY", "Saturday"),
    ]
    
    school_class = models.ForeignKey(SchoolClass, on_delete=models.CASCADE, related_name="timetables",)
    section = models.ForeignKey(Section, on_delete=models.CASCADE, related_name="timetables")
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name="timetables")
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name="timetables")
    day = models.CharField(max_length=20, choices=DAYS,)
    period = models.PositiveIntegerField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    
    class Meta:
        
        ordering = ["day", "period"]
        
        constraints = [
            models.UniqueConstraint(
                fields=[
                    "school_class",
                    "section",
                    "day",
                    "period",
                ],
                name="unique_class_section_day_period",
            )
        ]
        
        
        def __str__(self):
            return (
                f"{self.school_class} - "
                f"{self.section} - "
                f"{self.day} - "
                f"{self.period}"
            )