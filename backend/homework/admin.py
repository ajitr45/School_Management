from django.contrib import admin
from .models import Homework

# Register your models here.
@admin.register(Homework)
class HomeworkAdmin(admin.ModelAdmin):

    list_display = (
        "title",
        "school_class",
        "section",
        "subject",
        "teacher",
        "due_date",
    )

    search_fields = ("title",)