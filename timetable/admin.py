from django.contrib import admin
from .models import Timetable

# Register your models here.

@admin.register(Timetable)
class TimetableAdmin(admin.ModelAdmin):
    
    list_display = (
        "id",
        "school_class",
        "section",
        "subject",
        "teacher",
        "day",
        "period",
        "start_time",
        "end_time",
    )
    
    list_filter = (
        "school_class",
        "section",
        "day",
        "teacher",
    )
    
    search_fields = (
        "school_class__name",
        "section__name",
        "subject__name",
        "teacher__full_name"
    )
    
    ordering = (
        "school_class",
        "section",
        "day",
        "period",
    )
    
    readonly_fields = (
        "created_at",
        "updated_at",
    )