from django.utils import timezone
from django.db import transaction
from rest_framework.exceptions import ValidationError
from .models import StudentFee
from .utils import generate_receipt_number

@transaction.atomic
def create_student_fee(validated_data):

    fee_structure = validated_data["fee_structure"]
    amount_paid = validated_data["amount_paid"]

    # Prevent overpayment
    if amount_paid > fee_structure.amount:
        raise ValidationError(
            {
                "amount_paid": "Amount paid cannot be greater than total fee amount."
            }
        )

    # decide payment status
    if amount_paid == fee_structure.amount:
        status = "PAID" 
    else:
        status = "PENDING" 

    # Set payment date only if payment is made
    if amount_paid > 0:
        payment_date = timezone.now().date()
    else:
        payment_date = None
        
    # create student fee
    
    student_fee = StudentFee.objects.create(
        **validated_data,
        receipt_number=generate_receipt_number(),
        status=status,
        payment_date=payment_date,
    )

    return student_fee

@transaction.atomic
def update_student_fee(student_fee, validated_data):

    fee_structure = validated_data.get( "fee_structure", student_fee.fee_structure,)

    amount_paid = validated_data.get( "amount_paid", student_fee.amount_paid,)

    # Prevent overpayment
    if amount_paid > fee_structure.amount:
        raise ValidationError(
            {
                "amount_paid": "Amount paid cannot be greater than total fee amount."
            }
        )

    # Update provided fields
    for key, value in validated_data.items():
        setattr(student_fee, key, value)

    # Update payment status
    student_fee.status = (
        "PAID"
        if amount_paid == fee_structure.amount
        else "PENDING"
    )

    # Update payment date
    student_fee.payment_date = (
        timezone.now().date()
        if amount_paid > 0
        else None
    )

    student_fee.save()

    return student_fee