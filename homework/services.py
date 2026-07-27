from datetime import date
from rest_framework.exceptions import ValidationError
from .models import Homework


def create_homework(validate_data):
    
    school_class = validate_data["school_class"]
    section = validate_data["section"]
    subject = validate_data["subject"]
    due_date = validate_data["due_date"]
    
    if section.school_class != school_class:
        
        raise ValidationError(
            {
                "section": "Selected section does not belong to the selected class."
            }
        )
        
    if subject.school_class != school_class:
        
        raise ValidationError(
            {
                "subject": "Selected subject does not belong to selected class."
            }
        )
        
    if due_date < date.today():
        
        raise ValidationError(
            {
                "due_date": "Due date cannot be in past."
            }
        )
        
    return Homework.objects.create(**validate_data)



def update_homework(homework, validated_data):

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
