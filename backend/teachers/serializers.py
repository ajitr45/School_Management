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

    class Meta:

        model = TeacherAssignment

        fields = "__all__"
        
        
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