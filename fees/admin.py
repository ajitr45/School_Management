from django.contrib import admin
from .models import FeeStructure, StudentFee

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
    

@admin.register(StudentFee)

class StudentFeeAdmin(admin.ModelAdmin):
    
    list_display = (
        "student",
        "fee_structure",
        "amount_paid",
        "status",
        "payment_date",
        "receipt_number",
        
    )
    
    list_filter = (
        "status",
        "payment_date",
        
    )
    
    search_fields = (
        "student_name",
        "receipt_number",
    )
    
    ordering = (
        "-payment_date",
    )