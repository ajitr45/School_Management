from django.contrib import admin
from .models import Exam, ExamSubject, StudentResult

# Register your models here.

@admin.register(Exam)
class ExamAdmin(admin.ModelAdmin):
    
    list_display = (
        "id",
        "name",
        "school_class",
        "academic_year",
        "start_date",
        "end_date",
    )
    
    
    search_fields = (
        "name",
        "school_class_name"
    )
    
    ordering = ("-start_date",)
    
    
@admin.register(ExamSubject)
class ExamSubjectAdmin(admin.ModelAdmin):
    
    list_display = (
        "id",
        "exam",
        "subject",
        "maximum_marks",
        "pass_marks",
    )
    
    list_filter = (
        "exam",
        "subject",
    )
    
    search_fields = (
        "exam__name",
        "subject__name",
    )
    
    
@admin.register(StudentResult)
class StudentResultAdmin(admin.ModelAdmin):
    
    list_display =(
        "id",
        "student",
        "exam_subject",
        "marks_obtained",
        
    )
    
    list_filter =( "exam_subject__exam",)
    
    search_fields = (
        "student__admission__student_name",
        "exam_subject__subject__name",
    )