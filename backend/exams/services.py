from django.shortcuts import get_object_or_404
from rest_framework.exceptions import ValidationError
from .models import Exam, ExamSubject, StudentResult
from students.models import Student


def create_exam(validated_data):

    start_date = validated_data["start_date"]
    end_date = validated_data["end_date"]

    if end_date < start_date:
        raise ValidationError({"end_date": "End date cannot be before start date."})

    return Exam.objects.create(**validated_data)


def update_exam(exam, validated_data):

    start_date = validated_data.get("start_date", exam.start_date)
    end_date = validated_data.get("end_date", exam.end_date)

    if end_date < start_date:
        raise ValidationError({"end_date": "End date cannot be before start date."})

    for attr, value in validated_data.items():
        setattr(exam, attr, value)

    exam.save()
    return exam


def create_exam_subject(validated_data):

    exam = validated_data["exam"]
    subject = validated_data["subject"]
    maximum_marks = validated_data["maximum_marks"]
    pass_marks = validated_data["pass_marks"]

    if subject.school_class != exam.school_class:
        raise ValidationError({"subject": "Selected subject does not belong to the exam's class."})

    if pass_marks > maximum_marks:
        raise ValidationError({"pass_marks": "Pass marks cannot be greater than maximum marks."})

    return ExamSubject.objects.create(**validated_data)


def update_exam_subject(exam_subject, validated_data):

    exam = validated_data.get("exam", exam_subject.exam)
    subject = validated_data.get("subject", exam_subject.subject)
    maximum_marks = validated_data.get("maximum_marks", exam_subject.maximum_marks)
    pass_marks = validated_data.get("pass_marks", exam_subject.pass_marks)

    if subject.school_class != exam.school_class:
        raise ValidationError({"subject": "Selected subject does not belong to the exam's class."})

    if pass_marks > maximum_marks:
        raise ValidationError({"pass_marks": "Pass marks cannot be greater than maximum marks."})

    for attr, value in validated_data.items():
        setattr(exam_subject, attr, value)

    exam_subject.save()
    return exam_subject


def create_student_result(validated_data):

    student = validated_data["student"]
    exam_subject = validated_data["exam_subject"]
    marks_obtained = validated_data["marks_obtained"]
    exam = exam_subject.exam

    if student.school_class != exam.school_class:
        raise ValidationError({"student": "Student does not belong to the exam's class."})

    if marks_obtained > exam_subject.maximum_marks:
        raise ValidationError({"marks_obtained": "Marks obtained cannot exceed maximum marks."})

    return StudentResult.objects.create(**validated_data)


def update_student_result(student_result, validated_data):

    student = validated_data.get("student", student_result.student)
    exam_subject = validated_data.get("exam_subject", student_result.exam_subject)
    marks_obtained = validated_data.get("marks_obtained", student_result.marks_obtained)
    exam = exam_subject.exam

    if student.school_class != exam.school_class:
        raise ValidationError({"student": "Student does not belong to the exam's class."})

    if marks_obtained > exam_subject.maximum_marks:
        raise ValidationError({"marks_obtained": "Marks obtained cannot exceed maximum marks."})

    for attr, value in validated_data.items():
        setattr(student_result, attr, value)

    student_result.save()
    return student_result


def calculate_percentage(obtained_marks, total_marks):

    if total_marks == 0:
        return 0

    return round((obtained_marks / total_marks) * 100, 2)


def calculate_grade(percentage):

    if percentage >= 90:
        return "A+"

    elif percentage >= 80:
        return "A"

    elif percentage >= 70:
        return "B"

    elif percentage >= 60:
        return "C"

    elif percentage >= 33:
        return "D"

    return "F"


def calculate_status(marks_obtained, pass_marks):

    if marks_obtained >= pass_marks:
        return "PASS"

    return "FAIL"


def calculate_division(percentage):

    if percentage >= 60:
        return "First Division"

    elif percentage >= 45:
        return "Second Division"

    elif percentage >= 33:
        return "Third Division"

    return "Fail"


def generate_report_card(student_id, exam_id):

    student = get_object_or_404(Student,id=student_id)
    exam = get_object_or_404(Exam, id=exam_id)

    if student.school_class != exam.school_class:
        raise ValidationError({"exam": "This exam does not belong to the student's class."})

    results = (StudentResult.objects.filter(student=student, exam_subject__exam=exam) .select_related(
            "exam_subject",
            "exam_subject__subject"))

    subject_count = ExamSubject.objects.filter(exam=exam).count()

    if subject_count == 0:
        raise ValidationError({"detail": "No subjects are configured for this exam."})

    if results.count() != subject_count:
        raise ValidationError({
            "detail": ("Report card cannot be generated because all subject results are not available.")
        })

    total_marks = 0
    obtained_marks = 0
    overall_result = "PASS"

    subjects = []

    for result in results:

        exam_subject = result.exam_subject

        percentage = calculate_percentage(
            result.marks_obtained,
            exam_subject.maximum_marks
        )

        grade = calculate_grade(percentage)

        status = calculate_status(
            result.marks_obtained,
            exam_subject.pass_marks
        )

        if status == "FAIL":
            overall_result = "FAIL"

        total_marks += exam_subject.maximum_marks
        obtained_marks += result.marks_obtained

        subjects.append({
            "subject": exam_subject.subject.name,
            "maximum_marks": exam_subject.maximum_marks,
            "pass_marks": exam_subject.pass_marks,
            "marks_obtained": result.marks_obtained,
            "percentage": percentage,
            "grade": grade,
            "status": status,
            "remarks": result.remarks,
        })

    overall_percentage = calculate_percentage(
        obtained_marks,
        total_marks
    )

    return {
        "student": {
            "student_id": student.student_id,
            "student_name": student.admission.student_name,
            "school_class": student.school_class.name,
            "section": student.section.name,
        },
        "exam": {
            "exam_name": exam.name,
            "academic_year": exam.academic_year,
            "start_date": exam.start_date,
            "end_date": exam.end_date,
        },
        "subjects": subjects,
        "summary": {
            "total_marks": total_marks,
            "obtained_marks": obtained_marks,
            "percentage": overall_percentage,
            "grade": calculate_grade(overall_percentage),
            "division": calculate_division(overall_percentage),
            "result": overall_result,
        },
    }