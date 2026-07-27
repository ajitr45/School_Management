from django.db import models
from students.models import Student
from exams.models import Exam
from academics.models import Subject

class Result(models.Model):
    
    PASS = "PASS"
    FAIL = "FAIL"
    
    STATUS_CHOICES = [
        (PASS, "Pass"),
        (FAIL, "Fail"),
    ]
    
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="results")
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name="results")
    total_marks =models.PositiveIntegerField()
    obtained_marks = models.PositiveIntegerField()
    percentage = models.DecimalField(max_digits=5, decimal_places=2)
    grade = models.CharField(max_length=2)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES,)
    remarks = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    
    class Meta:
        
        ordering = ["-created_at"]
        
        constraints = [
            models.UniqueConstraint(
                fields=["student", "exam"],
                name="unique_student_exam_result",
            )
        ]
    
    def __str__(self):
        return f"{self.student} - {self.exam}"
    
    
class ResultDetail(models.Model):
    
    result = models.ForeignKey(Result, on_delete=models.CASCADE, related_name="result_details")
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name="result_details")
    obtained_marks = models.PositiveIntegerField()
    total_marks = models.PositiveIntegerField()
    remarks = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.result.student} - {self.subject}"