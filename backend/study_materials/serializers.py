from rest_framework import serializers
from .models import Chapter, StudyMaterial


class ChapterSerializer(serializers.ModelSerializer):

    class Meta:
        model = Chapter
        fields = "__all__"
        read_only_fields = ["created_at"]


class StudyMaterialSerializer(serializers.ModelSerializer):

    chapter_name = serializers.CharField(
        source="chapter.name",
        read_only=True,
    )

    chapter_number = serializers.IntegerField(
        source="chapter.chapter_number",
        read_only=True,
    )

    school_class = serializers.IntegerField(
        source="chapter.school_class.id",
        read_only=True,
    )

    subject = serializers.IntegerField(
        source="chapter.subject.id",
        read_only=True,
    )

    class_name = serializers.CharField(
        source="chapter.school_class.name",
        read_only=True,
    )

    subject_name = serializers.CharField(
        source="chapter.subject.name",
        read_only=True,
    )

    class Meta:
        model = StudyMaterial

        fields = [
            "id",
            "chapter",
            "chapter_name",
            "chapter_number",
            "school_class",
            "class_name",
            "subject",
            "subject_name",
            "description",
            "file",
            "created_at",
        ]

        read_only_fields = [
            "created_at",
            "chapter_name",
            "chapter_number",
            "school_class",
            "class_name",
            "subject",
            "subject_name",
        ]