from rest_framework.exceptions import ValidationError

from .models import Attendance


def create_attendance(request, validated_data):

    # teacher = request.user.teacher
    teacher = validated_data["teacher"]

    attendance_exists = Attendance.objects.filter(
        student=validated_data["student"],
        date=validated_data["date"],
    ).exists()

    if attendance_exists:
        raise ValidationError(
            {"message": "Attendance already marked for this student."}
        )

    attendance = Attendance.objects.create(
        student=validated_data["student"],
        teacher=teacher,
        date=validated_data["date"],
        status=validated_data["status"],
        remarks=validated_data.get("remarks"),
    )

    return attendance


def update_attendance(attendance, validated_data):

    attendance.status = validated_data.get("status", attendance.status ,)

    attendance.remarks = validated_data.get( "remarks", attendance.remarks,)

    attendance.save()

    return attendance