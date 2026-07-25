from django.core.exceptions import ValidationError

from .models import Timetable


def create_timetable(validated_data):

    school_class = validated_data["school_class"]
    section = validated_data["section"]
    subject = validated_data["subject"]
    teacher = validated_data["teacher"]
    day = validated_data["day"]
    period = validated_data["period"]
    start_time = validated_data["start_time"]
    end_time = validated_data["end_time"]

    if section.school_class != school_class:
        raise ValidationError(
            {"section": "Selected section does not belong to the selected class."}
        )

    if subject.school_class != school_class:
        raise ValidationError(
            {"subject": "Selected subject does not belong to the selected class."}
        )

    if start_time >= end_time:
        raise ValidationError(
            {"end_time": "End time must be greater than start time."}
        )

    if Timetable.objects.filter(
        teacher=teacher,
        day=day,
        start_time=start_time,
        end_time=end_time,
    ).exists():
        raise ValidationError(
            {"teacher": "Teacher is already assigned during this time."}
        )

    return Timetable.objects.create(**validated_data)


def update_timetable(timetable, validated_data):

    school_class = validated_data.get(
        "school_class",
        timetable.school_class,
    )

    section = validated_data.get(
        "section",
        timetable.section,
    )

    subject = validated_data.get(
        "subject",
        timetable.subject,
    )

    teacher = validated_data.get(
        "teacher",
        timetable.teacher,
    )

    day = validated_data.get(
        "day",
        timetable.day,
    )

    start_time = validated_data.get(
        "start_time",
        timetable.start_time,
    )

    end_time = validated_data.get(
        "end_time",
        timetable.end_time,
    )

    if section.school_class != school_class:
        raise ValidationError(
            {"section": "Selected section does not belong to the selected class."}
        )

    if subject.school_class != school_class:
        raise ValidationError(
            {"subject": "Selected subject does not belong to the selected class."}
        )

    if start_time >= end_time:
        raise ValidationError(
            {"end_time": "End time must be greater than start time."}
        )

    if Timetable.objects.filter(
        teacher=teacher,
        day=day,
        start_time=start_time,
        end_time=end_time,
    ).exclude(pk=timetable.pk).exists():
        raise ValidationError(
            {"teacher": "Teacher is already assigned during this time."}
        )

    for key, value in validated_data.items():
        setattr(timetable, key, value)

    timetable.save()

    return timetable