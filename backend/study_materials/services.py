from rest_framework.exceptions import ValidationError
from .models import Chapter, StudyMaterial


def create_chapter(validated_data):

    school_class = validated_data["school_class"]
    subject = validated_data["subject"]

    # Validate that the selected subject belongs to the selected class.
    if subject.school_class != school_class:
        raise ValidationError({"subject": "Selected subject does not belong to selected class."})

    # Prevent duplicate chapter numbers within the same class and subject.
    chapter_exists = Chapter.objects.filter(
        school_class=school_class,
        subject=subject,
        chapter_number=validated_data["chapter_number"],
    ).exists()

    if chapter_exists:
        raise ValidationError({"chapter_number": "This chapter number already exists for this subject."})

    return Chapter.objects.create(**validated_data)


def update_chapter(chapter, validated_data):

    school_class = validated_data.get("school_class", chapter.school_class)
    subject = validated_data.get("subject", chapter.subject)
    chapter_number = validated_data.get("chapter_number", chapter.chapter_number)

    # Validate that the selected subject belongs to the selected class.
    if subject.school_class != school_class:
        raise ValidationError({"subject": "Selected subject does not belong to selected class."})

    # Prevent duplicate chapter numbers within the same class and subject.
    chapter_exists = Chapter.objects.filter(
        school_class=school_class,
        subject=subject,
        chapter_number=chapter_number,
    ).exclude(pk=chapter.pk).exists()

    if chapter_exists:
        raise ValidationError({"chapter_number": "This chapter number already exists for this subject."})

    for field, value in validated_data.items():
        setattr(chapter, field, value)

    chapter.save()

    return chapter


def create_study_material(validated_data):

    chapter = validated_data["chapter"]

    return StudyMaterial.objects.create(**validated_data)


def update_study_material(study_material, validated_data):

    for field, value in validated_data.items():
        setattr(study_material, field, value)

    study_material.save()

    return study_material