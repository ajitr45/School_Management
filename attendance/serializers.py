from rest_framework import serializers
from .models import Attendance


class AttendanceCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Attendance
        fields = [
            "student",
            "date",
            "status",
            "remarks",
        ]


class AttendanceUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Attendance
        fields = [
            "status",
            "remarks",
        ]


class AttendanceDetailSerializer(serializers.ModelSerializer):

    class Meta:
        model = Attendance
        fields = "__all__"