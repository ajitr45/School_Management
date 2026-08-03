from django.db import transaction
from django.shortcuts import get_object_or_404
from accounts.models import User
from students.models import Student
from students.utils import generate_student_id,generate_roll_number,generate_password
from rest_framework.exceptions import ValidationError

from .models import Admission


@transaction.atomic
def approve_admission(admission_id, section):

    # Get Admission
    admission = get_object_or_404(Admission,pk=admission_id)

    # Check Already Approved
    if admission.status == "APPROVED":
        raise ValueError("Admission is already approved.")
    
    # Validate section with the applying class.
    if section.school_class != admission.applying_class:
        raise ValidationError(
        {
            "section": "Selected section does not belong to the applying class."
        }
    )
        
    student_id = generate_student_id()
    password = generate_password()
    roll_number = generate_roll_number(admission.applying_class,section)

    # Create User
    user = User.objects.create_user(
        username=student_id,
        email=admission.student_email,
        password=password,
        role=User.STUDENT
    )

    # Create Student
    Student.objects.create(
        user=user,
        admission=admission,
        student_id=student_id,
        roll_number=roll_number,
        school_class=admission.applying_class,
        section=section
    )

    # Update Admission Status
    admission.status = "APPROVED"
    admission.save()

    return {
        "message": "Admission approved successfully.",
        "student_id": student_id,
        "username": student_id,
        "password": password,
    }