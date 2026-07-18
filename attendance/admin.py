from django.contrib import admin
from .models import Attendance

# Register your models here.
@admin.register(Attendance)
class AttendenceAdmin(admin.ModelAdmin):
    
    list_display = (
        "student",
        "teacher",
        "date",
        "status",
        "created_at",
    )

    list_filter = (
        "status",
        "date",
    )
    
    search_fields = (
        "student__full_name",
        "teacher__fullname",
    )
    
    ordering = ("-date",)