from django.db import transaction
from django.db.models import Sum
from rest_framework.exceptions import ValidationError
from .models import (FeeStructure, StudentFee, FeePayment)
from .utils import generate_receipt_number


@transaction.atomic
def create_fee_structure(validated_data):

    fee_structure = FeeStructure.objects.create(**validated_data)

    return fee_structure


@transaction.atomic
def update_fee_structure(fee_structure, validated_data):

    for key, value in validated_data.items():
        setattr(fee_structure, key, value)

    fee_structure.save()

    return fee_structure


@transaction.atomic
def create_student_fee(validated_data):

    student_fee = StudentFee.objects.create(**validated_data)

    return student_fee


@transaction.atomic
def update_student_fee(student_fee, validated_data):

    # Student and fee structure should not be changed after the fee has been assigned.
    validated_data.pop("student", None)
    validated_data.pop("fee_structure", None)

    for key, value in validated_data.items():
        setattr(student_fee, key, value)

    student_fee.save()

    return student_fee


@transaction.atomic
def create_fee_payment(validated_data):

    student_fee = validated_data["student_fee"]
    amount = validated_data["amount"]

    # Calculate total amount already paid.
    total_paid = (student_fee.payments.aggregate(total=Sum("amount"))["total"] or 0)
    total_fee = student_fee.fee_structure.amount

    # Prevent overpayment.
    if total_paid + amount > total_fee:
        raise ValidationError(
            {
                "amount": "Payment amount exceeds the total fee."
            }
        )

    # Create payment with generated receipt number.
    fee_payment = FeePayment.objects.create(**validated_data, receipt_number=generate_receipt_number())
    total_paid += amount

    # Update fee status.
    if total_paid == total_fee:
        student_fee.status = "PAID"

    elif total_paid > 0:
        student_fee.status = "PARTIAL"

    else:
        student_fee.status = "PENDING"

    student_fee.save()

    return fee_payment


@transaction.atomic
def update_fee_payment(fee_payment, validated_data):

    # Existing payment cannot be moved to another StudentFee.
    validated_data.pop("student_fee", None)
    student_fee = fee_payment.student_fee
    old_amount = fee_payment.amount
    new_amount = validated_data.get("amount", old_amount)

    # Calculate total amount already paid.
    total_paid = (student_fee.payments.aggregate(total=Sum("amount"))["total"] or 0)
    total_fee = student_fee.fee_structure.amount

    # Remove old payment and add new payment.
    total_after_update = (total_paid - old_amount + new_amount)

    # Prevent overpayment.
    if total_after_update > total_fee:
        raise ValidationError(
            {
                "amount": "Payment amount exceeds the total fee."
            }
        )

    for key, value in validated_data.items():
        setattr(fee_payment, key, value)

    fee_payment.save()

    # Update fee status.
    if total_after_update == total_fee:
        student_fee.status = "PAID"

    elif total_after_update > 0:
        student_fee.status = "PARTIAL"

    else:
        student_fee.status = "PENDING"

    student_fee.save()

    return fee_payment