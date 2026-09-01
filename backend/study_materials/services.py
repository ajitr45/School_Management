from rest_framework.exceptions import ValidationError
from accounts.models import User
from teachers.models import TeacherAssignment
from .models import Chapter, StudyMaterial


# =========================================================
# CHAPTER
# =========================================================

def create_chapter(validated_data):

    school_class = validated_data["school_class"]
    subject = validated_data["subject"]

    # Subject must belong to the selected class.
    if subject.school_class != school_class:
        raise ValidationError({
            "subject":
                "Selected subject does not belong to selected class."
        })

    # Prevent duplicate chapter numbers for the same subject.
    chapter_exists = Chapter.objects.filter(
        school_class=school_class,
        subject=subject,
        chapter_number=validated_data["chapter_number"],
    ).exists()

    if chapter_exists:
        raise ValidationError({
            "chapter_number":
                "This chapter number already exists for this subject."
        })

    return Chapter.objects.create(**validated_data)


def update_chapter(chapter, validated_data):

    school_class = validated_data.get(
        "school_class",
        chapter.school_class
    )

    subject = validated_data.get(
        "subject",
        chapter.subject
    )

    chapter_number = validated_data.get(
        "chapter_number",
        chapter.chapter_number
    )

    # Subject must belong to the selected class.
    if subject.school_class != school_class:
        raise ValidationError({
            "subject":
                "Selected subject does not belong to selected class."
        })

    # Prevent duplicate chapter numbers for the same subject.
    chapter_exists = Chapter.objects.filter(
        school_class=school_class,
        subject=subject,
        chapter_number=chapter_number,
    ).exclude(
        pk=chapter.pk
    ).exists()

    if chapter_exists:
        raise ValidationError({
            "chapter_number":
                "This chapter number already exists for this subject."
        })

    for field, value in validated_data.items():
        setattr(chapter, field, value)

    chapter.save()

    return chapter


# =========================================================
# STUDY MATERIAL
# =========================================================

def create_study_material(validated_data, request):

    chapter = validated_data["chapter"]

    # Teacher can upload only for assigned class and subject.
    if request.user.role == User.TEACHER:

        teacher = request.user.teacher

        is_assigned = TeacherAssignment.objects.filter(
            teacher=teacher,
            school_class=chapter.school_class,
            subject=chapter.subject,
        ).exists()

        if not is_assigned:
            raise ValidationError({
                "chapter":"You cannot upload study material for this chapter."})

    return StudyMaterial.objects.create(
        **validated_data
    )


def update_study_material(request, study_material, validated_data):

    if request.user.role == User.TEACHER:

        teacher = request.user.teacher

        # Validate the new chapter if chapter is changed.
        chapter = validated_data.get("chapter", study_material.chapter)
        is_assigned = TeacherAssignment.objects.filter(
            teacher=teacher,
            school_class=chapter.school_class,
            subject=chapter.subject,
        ).exists()

        if not is_assigned:
            raise ValidationError({"chapter": "You cannot update study material for this chapter."})

    for field, value in validated_data.items():
        setattr(study_material, field, value)

    study_material.save()

    return study_material