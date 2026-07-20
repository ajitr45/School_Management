from django.db import models
from academics.models import SchoolClass

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