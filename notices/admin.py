from django.contrib import admin
from .models import Notice


@admin.register(Notice)
class NoticeAdmin(admin.ModelAdmin):

    list_display = (
        "title",
        "audience",
        "school_class",
        "expiry_date",
        "created_at",
    )
    
    list_filter = ("audience", "school_class")
    search_fields = ("title",)