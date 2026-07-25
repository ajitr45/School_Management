from rest_framework import serializers

from .models import Timetable


class TimetableSerializer(serializers.ModelSerializer):

    class_name = serializers.CharField( source="school_class.name", read_only=True,)
    section_name = serializers.CharField( source="section.name", read_only=True,)
    subject_name = serializers.CharField( source="subject.name", read_only=True,)
    teacher_name = serializers.CharField( source="teacher.full_name", read_only=True,)

    class Meta:

        model = Timetable

        fields = [
            "id",
            "school_class",
            "class_name",
            "section",
            "section_name",
            "subject",
            "subject_name",
            "teacher",
            "teacher_name",
            "day",
            "period",
            "start_time",
            "end_time",
            "created_at",
            "updated_at",
        ]

        read_only_fields = (
            "created_at",
            "updated_at",
        )