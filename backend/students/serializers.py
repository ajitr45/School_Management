from rest_framework import serializers

from .models import Student
from accounts.models import User
from academics.models import SchoolClass, Section
from admissions.models import Admission


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


class StudentAdmissionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Admission
        fields = "__all__"


class StudentSerializer(serializers.ModelSerializer):

    # User sirf display ke liye
    user = UserSerializer(
        read_only=True
    )

    # Admission editable hai
    admission = StudentAdmissionSerializer()

    # Class ka naam display ke liye
    school_class_detail = SchoolClassSerializer(
        source="school_class",
        read_only=True
    )

    # Section ka naam display ke liye
    section_detail = SectionSerializer(
        source="section",
        read_only=True
    )

    # Class editable
    school_class = serializers.PrimaryKeyRelatedField(
        queryset=SchoolClass.objects.all()
    )

    # Section editable
    section = serializers.PrimaryKeyRelatedField(
        queryset=Section.objects.all()
    )

    class Meta:
        model = Student

        fields = [
            "id",
            "user",
            "admission",
            "student_id",
            "roll_number",
            "school_class",
            "school_class_detail",
            "section",
            "section_detail",
            "admission_date",
        ]

        read_only_fields = [
            "id",
            "user",
            "student_id",
            "roll_number",
            "admission_date",
        ]

    def update(self, instance, validated_data):

        # Admission data nikal lo
        admission_data = validated_data.pop(
            "admission",
            None
        )

        # Admission update
        if admission_data:

            admission = instance.admission

            for field, value in admission_data.items():

                setattr(
                    admission,
                    field,
                    value
                )

            admission.save()

        # Student update
        instance = super().update(
            instance,
            validated_data
        )

        return instance