from django.db import models
from academics.models import SchoolClass, Subject 
from students.models import Student

# Create your models here.

class Exam(models.Model):
    
    name = models.CharField(max_length=100)
    school_class = models.ForeignKey(SchoolClass , on_delete=models.CASCADE, related_name="exams")
    academic_year = models.CharField(max_length=20)
    start_date = models.DateField()
    end_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at =  models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ["-start_date"]
        
        
    def __str__(self):
        return f"{self.name} - {self.school_class.name}"
            
            
            
class ExamSubject(models.Model):
    
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name="exam_subjects")
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name="exam_subjects")
    maximum_marks = models.PositiveIntegerField()
    pass_marks = models.PositiveIntegerField()
    
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["exam", "subject"],
                name = "unique_exam_subject",
            )
        ]
        
    def __str__(self):
        return f"{self.exam.name} - {self.subject.name}"
    
    
    
class StudentResult(models.Model):

    student = models.ForeignKey( Student, on_delete=models.CASCADE, related_name="results",)
    exam_subject = models.ForeignKey(ExamSubject, on_delete=models.CASCADE, related_name="student_results",)
    marks_obtained = models.PositiveIntegerField()
    remarks = models.TextField( blank=True, null=True,)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True,)

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["student", "exam_subject"],
                name="unique_student_exam_subject",
            )
        ]

    def __str__(self):
        return (
            f"{self.student.admission.student_name} - "
            f"{self.exam_subject.subject.name}"
        )