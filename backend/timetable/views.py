from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import PermissionDenied
from accounts.models import User
from accounts.permissions import IsAdmin, IsAdminTeacherOrStudent
from .models import Timetable
from .serializers import TimetableSerializer
from .services import create_timetable, update_timetable


class TimetableListCreateAPIView(APIView):

    def get_permissions(self):

        if self.request.method == "GET":
            permission_classes = [IsAdminTeacherOrStudent]
        else:
            permission_classes = [IsAdmin]

        return [permission() for permission in permission_classes]

    def get(self, request):

        timetables = Timetable.objects.all()

        # Students can only see timetable of their own class and section.
        if request.user.role == User.STUDENT:

            timetables = timetables.filter(school_class=request.user.student.school_class, section=request.user.student.section)
        
        elif request.user.role == User.TEACHER:
            
            timetables = timetables.filter(teacher= request.user.teacher)

        serializer = TimetableSerializer(timetables, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):

        serializer = TimetableSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        timetable = create_timetable(serializer.validated_data)

        return Response(TimetableSerializer(timetable).data, status=status.HTTP_201_CREATED)


class TimetableDetailAPIView(APIView):

    def get_permissions(self):

        if self.request.method == "GET":
            permission_classes = [IsAdminTeacherOrStudent]
        else:
            permission_classes = [IsAdmin]

        return [permission() for permission in permission_classes]

    def get(self, request, pk):

        timetable = get_object_or_404(Timetable, pk=pk)

        # Teacher can view only their own timetable.
        if request.user.role == User.TEACHER:

            if timetable.teacher != request.user.teacher:
                raise PermissionDenied("You cannot view this timetable.")

        # Student can view only their own class and section timetable.
        elif request.user.role == User.STUDENT:

            if (
                timetable.school_class != request.user.student.school_class
                or timetable.section != request.user.student.section
            ):
                raise PermissionDenied("You cannot view this timetable.")

        serializer = TimetableSerializer(timetable)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):

        timetable = get_object_or_404(Timetable, pk=pk)
        serializer = TimetableSerializer(timetable, data=request.data)
        serializer.is_valid(raise_exception=True)
        timetable = update_timetable(timetable, serializer.validated_data)

        return Response(TimetableSerializer(timetable).data, status=status.HTTP_200_OK)

    def patch(self, request, pk):

        timetable = get_object_or_404(Timetable, pk=pk)
        serializer = TimetableSerializer(timetable, data=request.data, partial=True,)
        serializer.is_valid(raise_exception=True)
        timetable = update_timetable(timetable, serializer.validated_data)

        return Response(TimetableSerializer(timetable).data, status=status.HTTP_200_OK)

    def delete(self, request, pk):

        timetable = get_object_or_404(Timetable, pk=pk)
        timetable.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)