from datetime import date
from rest_framework.exceptions import ValidationError
from .models import Homework
from teachers.models import TeacherAssignment


def create_homework(request, validated_data):

    teacher = request.user.teacher

    school_class = validated_data["school_class"]
    section = validated_data["section"]
    subject = validated_data["subject"]
    due_date = validated_data["due_date"]

    # Section must belong to selected class
    if section.school_class != school_class:
        raise ValidationError({"section": "Selected section does not belong to the selected class."})

    # Subject must belong to selected class
    if subject.school_class != school_class:
        raise ValidationError({"subject": "Selected subject does not belong to selected class."})

    # Teacher must be assigned to this class, section and subject
    is_assigned = TeacherAssignment.objects.filter(
        teacher=teacher,
        school_class=school_class,
        section=section,
        subject=subject,
    ).exists()

    if not is_assigned:
        raise ValidationError({"detail": "You are not assigned to this class, section and subject."})

    if due_date < date.today():
        raise ValidationError({"due_date": "Due date cannot be in past."})

    return Homework.objects.create(teacher=teacher, **validated_data)



def update_homework(homework, validated_data):

    # If a field is not provided in PATCH request,use the existing value from the homework object.
    school_class = validated_data.get( "school_class", homework.school_class,)
    section = validated_data.get( "section", homework.section,)
    subject = validated_data.get( "subject", homework.subject,)
    due_date = validated_data.get( "due_date", homework.due_date,)

    if section.school_class != school_class:
        raise ValidationError(
            {
                "section": "Selected section does not belong to the selected class."
            }
        )

    if subject.school_class != school_class:
        raise ValidationError(
            {
                "subject": "Selected subject does not belong to the selected class."
            }
        )

    if due_date < date.today():
        raise ValidationError(
            {
                "due_date": "Due date cannot be in the past."
            }
        )

    for field, value in validated_data.items():
        setattr(homework, field, value)

    homework.save()

    return homework