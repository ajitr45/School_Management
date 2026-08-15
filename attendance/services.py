from rest_framework.exceptions import ValidationError
from .models import Attendance


def create_attendance(request, validated_data):

    teacher = request.user.teacher

    attendance_exists = Attendance.objects.filter(
        student=validated_data["student"],
        date=validated_data["date"],).exists()

    if attendance_exists:
        raise ValidationError({
            "detail": "Attendance already marked for this student on this date."
        })

    attendance = Attendance.objects.create(
        teacher=teacher,
        **validated_data,
    )

    return attendance


def update_attendance(attendance, validated_data):

    attendance.status = validated_data.get("status", attendance.status ,)

    attendance.remarks = validated_data.get( "remarks", attendance.remarks,)

    attendance.save()

    return attendance