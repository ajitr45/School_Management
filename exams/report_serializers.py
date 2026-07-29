from rest_framework import serializers


class StudentReportSerializer(serializers.Serializer):
    student_id = serializers.CharField()
    student_name = serializers.CharField()
    school_class = serializers.CharField()
    section = serializers.CharField()


class ExamReportSerializer(serializers.Serializer):
    exam_name = serializers.CharField()
    academic_year = serializers.CharField()
    start_date = serializers.DateField()
    end_date = serializers.DateField()


class SubjectReportSerializer(serializers.Serializer):
    subject = serializers.CharField()
    maximum_marks = serializers.IntegerField()
    pass_marks = serializers.IntegerField()
    marks_obtained = serializers.IntegerField()
    percentage = serializers.FloatField()
    grade = serializers.CharField()
    status = serializers.CharField()
    remarks = serializers.CharField( allow_blank=True, allow_null=True, required=False,)


class SummarySerializer(serializers.Serializer):
    total_marks = serializers.IntegerField()
    obtained_marks = serializers.IntegerField()
    percentage = serializers.FloatField()
    grade = serializers.CharField()
    division = serializers.CharField()
    result = serializers.CharField()


class ReportCardSerializer(serializers.Serializer):
    student = StudentReportSerializer()
    exam = ExamReportSerializer()
    subjects = SubjectReportSerializer(many=True)
    summary = SummarySerializer()