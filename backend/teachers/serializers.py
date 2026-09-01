from rest_framework import serializers

from .models import Teacher, TeacherAssignment


class TeacherSerializer(serializers.ModelSerializer):

    email = serializers.EmailField()

    class Meta:

        model = Teacher

        fields = [
            "teacher_id",
            "full_name",
            "email",
            "mobile",
            "qualification",
            "experience",
            "date_of_birth",
            "gender",
            "address",
            "photo",
            "joining_date",
        ]

        read_only_fields = ["teacher_id",]


class TeacherAssignmentSerializer(serializers.ModelSerializer):

    teacher_name = serializers.CharField(source="teacher.full_name", read_only=True)
    class_name = serializers.CharField(source="school_class.name", read_only=True)
    section_name = serializers.CharField(source="section.name", read_only=True)
    subject_name = serializers.CharField(source="subject.name", read_only=True)

    class Meta:
        model = TeacherAssignment

        fields = [
            "id",
            "teacher",
            "teacher_name",
            "school_class",
            "class_name",
            "section",
            "section_name",
            "subject",
            "subject_name",
        ]
        
        
class TeacherListSerializer(serializers.ModelSerializer):

    email = serializers.EmailField(source="user.email",read_only=True)

    class Meta:

        model = Teacher

        fields = [
            "id",
            "teacher_id",
            "full_name",
            "email",
            "mobile",
            "qualification",
            "experience",
            "joining_date",
        ]


class TeacherDetailSerializer(serializers.ModelSerializer):

    email = serializers.EmailField(source="user.email",read_only=True)

    class Meta:

        model = Teacher

        fields = [
            "id",
            "teacher_id",
            "full_name",
            "email",
            "mobile",
            "qualification",
            "experience",
            "date_of_birth",
            "gender",
            "address",
            "photo",
            "joining_date",
        ]


class TeacherUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Teacher
        fields = [
            "full_name",
            "mobile",
            "qualification",
            "experience",
            "date_of_birth",
            "gender",
            "address",
            "photo",
        ]        