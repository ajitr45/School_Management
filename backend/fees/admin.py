from django.contrib import admin
from .models import FeeStructure, StudentFee, FeePayment


@admin.register(FeeStructure)
class FeeStructureAdmin(admin.ModelAdmin):
    list_display = (
        "school_class",
        "academic_year",
        "amount",
        "due_date",
        "is_active",
    )
    list_filter = (
        "academic_year",
        "is_active",
    )
    search_fields = (
        "school_class__name",
        "academic_year",
    )


@admin.register(StudentFee)
class StudentFeeAdmin(admin.ModelAdmin):
    list_display = (
        "student",
        "fee_structure",
        "status",
        "assigned_date",
    )
    list_filter = (
        "status",
    )
    search_fields = (
        "student__admission__student_name",
    )


@admin.register(FeePayment)
class FeePaymentAdmin(admin.ModelAdmin):
    list_display = (
        "student_fee",
        "amount",
        "payment_method",
        "receipt_number",
        "payment_date",
    )
    list_filter = (
        "payment_method",
        "payment_date",
    )
    search_fields = (
        "receipt_number",
        "student_fee__student__admission__student_name",
    )