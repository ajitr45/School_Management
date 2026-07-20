from django.contrib import admin
from .models import FeeStructure

# Register your models here.


@admin.register(FeeStructure)
class FeeStructureAdmin(admin.ModelAdmin):

    list_display = (
        "school_class",
        "academic_year",
        "amount",
        "due_date",
        "is_active",
        "created_at",
    )

    list_filter = (
        "academic_year",
        "is_active",
    )

    search_fields = (
        "school_class__name",
    )

    ordering = (
        "-academic_year",
        "school_class",
    )
    