from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from accounts.models import User
from accounts.permissions import IsTeacher, IsAdminOrTeacher, IsAdminTeacherOrStudent
from .models import Attendance
from .serializers import (AttendanceCreateSerializer, AttendanceUpdateSerializer, AttendanceDetailSerializer)
from .services import (create_attendance, update_attendance)


class AttendanceListCreateAPIView(APIView):

    def get_permissions(self):

        if self.request.method == "GET":
            permission_classes = [IsAuthenticated, IsAdminTeacherOrStudent]
        else:
            permission_classes = [IsAuthenticated, IsTeacher]

        return [permission() for permission in permission_classes]

    def get(self, request):

        if request.user.role == User.ADMIN:
            attendances = Attendance.objects.all()

        elif request.user.role == User.TEACHER:
            attendances = Attendance.objects.filter(teacher=request.user.teacher)

        else:
            attendances = Attendance.objects.filter(student=request.user.student)

        serializer = AttendanceDetailSerializer(attendances,many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        
        serializer = AttendanceCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        attendance = create_attendance(request, serializer.validated_data)
        serializer = AttendanceDetailSerializer(attendance)

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class AttendanceDetailAPIView(APIView):

    def get_permissions(self):

        if self.request.method == "GET":
            permission_classes = [IsAuthenticated, IsAdminTeacherOrStudent]
        else:
            permission_classes = [IsAuthenticated,IsAdminOrTeacher]

        return [permission() for permission in permission_classes]

    def get(self, request, pk):

        attendance = get_object_or_404(Attendance, pk=pk)

        # Object Level Validation
        if request.user.role == User.TEACHER:
            if attendance.teacher != request.user.teacher:
                raise PermissionDenied(
                    "You cannot view this attendance."
                )

        elif request.user.role == User.STUDENT:
            if attendance.student != request.user.student:
                raise PermissionDenied(
                    "You can view only your attendance."
                )

        serializer = AttendanceDetailSerializer(attendance)

        return Response(serializer.data)

    def patch(self, request, pk):

        attendance = get_object_or_404(Attendance, pk=pk)

        if (request.user.role == User.TEACHER and attendance.teacher != request.user.teacher):
            
            raise PermissionDenied("You cannot update this attendance.")

        serializer = AttendanceUpdateSerializer(attendance, data=request.data, partial=True)

        serializer.is_valid(raise_exception=True)

        attendance = update_attendance(attendance, serializer.validated_data)

        serializer = AttendanceDetailSerializer(attendance)

        return Response(serializer.data)