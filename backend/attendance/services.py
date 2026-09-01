from rest_framework.exceptions import ValidationError
from .models import Attendance
from teachers.models import TeacherAssignment


def create_attendance(request, validated_data):

    teacher = request.user.teacher
    student = validated_data["student"]
    is_assigned = TeacherAssignment.objects.filter( teacher=teacher, school_class=student.school_class, section=student.section).exists()

    if not is_assigned:
        raise ValidationError({"student": "You cannot mark attendance for this student."})

    attendance_exists = Attendance.objects.filter( student=student, date=validated_data["date"]).exists()

    if attendance_exists:
        raise ValidationError({"detail": "Attendance already marked for this student on this date."})
    attendance = Attendance.objects.create(teacher=teacher, **validated_data,)

    return attendance


def update_attendance(attendance, validated_data):

    attendance.status = validated_data.get("status", attendance.status ,)

    attendance.remarks = validated_data.get( "remarks", attendance.remarks,)

    attendance.save()

    return attendance