from django.contrib import admin

from .models import Attendance


@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):

    list_display = (
        "student",
        "teacher",
        "date",
        "status",
        "created_at",
    )

    list_filter = ("status", "date",)

    search_fields = (
        "student__admission__student_name",
        "teacher__full_name",
    )

    ordering = ("-date",)