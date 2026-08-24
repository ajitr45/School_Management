from rest_framework import serializers
from .models import Student
from accounts.models import User
from academics.models import SchoolClass, Section


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
        ]


class SchoolClassSerializer(serializers.ModelSerializer):

    class Meta:
        model = SchoolClass
        fields = [
            "id",
            "name",
        ]


class SectionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Section
        fields = [
            "id",
            "name",
        ]


class StudentSerializer(serializers.ModelSerializer):

    user = UserSerializer(read_only=True)
    school_class = SchoolClassSerializer(read_only=True)
    section = SectionSerializer(read_only=True)

    class Meta:
        model = Student

        fields = "__all__"

        read_only_fields = [
            "student_id",
            "roll_number",
            "admission_date",
        ]