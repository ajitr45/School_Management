from django.db import models
from students.models import Student
from teachers.models import Teacher

# Create your models here.

class Attendance(models.Model):
    
    STATUS_CHOICES =[
        ("PRESENT", "Present"),
        ("ABSENT", "Absent"),
        ("LEAVE", "Leave"),
    ]

    student = models.ForeignKey(Student,on_delete=models.CASCADE,related_name="attendances")
    teacher = models.ForeignKey(Teacher,on_delete=models.CASCADE,related_name="marked_attendances")
    date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    remarks = models.TextField( blank=True, null=True)
    created_at = models.DateTimeField(auto_now=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [models.UniqueConstraint(fields=["student", "date"],name="unique_student_attendance")]

    def __str__(self):
        return f"{self.student.full_name} - {self.date}"