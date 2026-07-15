from django.db import transaction
from accounts.models import User
from students.utils import generate_password
from .models import Teacher
from .utils import generate_teacher_id


@transaction.atomic
def create_teacher(validated_data):

    teacher_id = generate_teacher_id()

    password = generate_password()

    user = User.objects.create_user(
        username=teacher_id,
        email=validated_data["email"],
        password=password,
        role="TEACHER"
    )

    teacher = Teacher.objects.create(
        user=user,
        teacher_id=teacher_id,
        full_name=validated_data["full_name"],
        mobile=validated_data["mobile"],
        qualification=validated_data["qualification"],
        experience=validated_data["experience"],
        date_of_birth=validated_data["date_of_birth"],
        gender=validated_data["gender"],
        address=validated_data["address"],
        photo=validated_data.get("photo"),
        joining_date=validated_data["joining_date"],
    )

    return {
        "message": "Teacher created successfully.",
        "teacher_id": teacher.teacher_id,
        "username": teacher.teacher_id,
        "password": password,
    }
    
    
from django.db import transaction

from rest_framework.exceptions import ValidationError

from .models import TeacherAssignment


@transaction.atomic
def assign_teacher(validated_data):

    teacher = validated_data["teacher"]
    school_class = validated_data["school_class"]
    section = validated_data["section"]
    subject = validated_data["subject"]

    # Validate section with selected class
    if section.school_class != school_class:
        raise ValidationError(
            {
                "section": "Selected section does not belong to the selected class."
            }
        )

    # Validate subject with selected class
    if subject.school_class != school_class:
        raise ValidationError(
            {
                "subject": "Selected subject does not belong to the selected class."
            }
        )

    # Prevent duplicate assignment
    if TeacherAssignment.objects.filter(
        teacher=teacher,
        school_class=school_class,
        section=section,
        subject=subject,
    ).exists():
        raise ValidationError(
            {
                "detail": "This teacher is already assigned to the selected class, section and subject."
            }
        )

    assignment = TeacherAssignment.objects.create(
        teacher=teacher,
        school_class=school_class,
        section=section,
        subject=subject,
    )

    return {
        "message": "Teacher assigned successfully.",
        "assignment_id": assignment.id,
    }