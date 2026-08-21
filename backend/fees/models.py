from django.db import models
from academics.models import SchoolClass
from students.models import Student

# Create your models here.

class FeeStructure(models.Model):
    school_class = models.ForeignKey(SchoolClass,on_delete=models.CASCADE,related_name="fee_structures")

    academic_year = models.CharField(max_length=20)
    amount = models.DecimalField( max_digits=10, decimal_places=2)
    due_date = models.DateField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["school_class", "academic_year"],
                name= "unique_class_academic_year",
            )
        ]
        
        ordering = [
            "-academic_year",
            "school_class",
        ]

    def __str__(self):
        return f"{self.school_class.name} ({self.academic_year}) - ₹{self.amount}"
    
    
    
    
    
class StudentFee(models.Model):

    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("PARTIAL", "Partial"),
        ("PAID", "Paid"),
    ]

    student = models.ForeignKey( Student,
        on_delete=models.CASCADE,
        related_name="student_fees",
    )

    fee_structure = models.ForeignKey( FeeStructure,
        on_delete=models.CASCADE,
        related_name="student_fees",
    )

    status = models.CharField( max_length=10,
        choices=STATUS_CHOICES,
        default="PENDING",
    )

    assigned_date = models.DateField(auto_now_add=True,)
    created_at = models.DateTimeField(auto_now_add=True,)
    updated_at = models.DateTimeField(auto_now=True,)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["student", "fee_structure"],
                name="unique_student_fee_structure",
            )
        ]

    def __str__(self):
        return f"{self.student.admission.student_name} - {self.fee_structure.academic_year}"
    
    
class FeePayment(models.Model):

    PAYMENT_METHOD_CHOICES = [
        ("CASH", "Cash"),
        ("UPI", "UPI"),
        ("CARD", "Card"),
    ]

    student_fee = models.ForeignKey( StudentFee,
        on_delete=models.CASCADE,
        related_name="payments",
    )

    amount = models.DecimalField( max_digits=10, decimal_places=2,)
    payment_method = models.CharField( max_length=10, choices=PAYMENT_METHOD_CHOICES,)
    payment_date = models.DateField(auto_now_add=True,)
    receipt_number = models.CharField( max_length=50, unique=True,)
    transaction_id = models.CharField( max_length=100, blank=True, null=True )
    remarks = models.TextField( blank=True, null=True,)
    created_at = models.DateTimeField(auto_now_add=True,)
    updated_at = models.DateTimeField( auto_now=True,)

    def __str__(self):
        return f"{self.student_fee.student.admission.student_name} - {self.amount}"