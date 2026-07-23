from rest_framework import serializers
from .models import Exam, ExamSubject, StudentResult


class ExamSerializer(serializers.ModelSerializer):

    class Meta:
        model = Exam
        fields = "__all__"


class ExamSubjectSerializer(serializers.ModelSerializer):

    exam_name = serializers.CharField(  source="exam.name", read_only=True )
    subject_name = serializers.CharField( source="subject.name", read_only=True,)

    class Meta:
        model = ExamSubject
        fields = "__all__"


class StudentResultSerializer(serializers.ModelSerializer):

    student_name = serializers.CharField(source="student.admission.student_name", read_only=True )
    exam_name = serializers.CharField(source="exam_subject.exam.name", read_only=True,)
    subject_name = serializers.CharField(source="exam_subject.subject.name", read_only=True,)

    class Meta:
        model = StudentResult
        fields = "__all__"