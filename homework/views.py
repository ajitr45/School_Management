from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import PermissionDenied
from accounts.models import User
from accounts.permissions import (IsAdminOrTeacher, IsAdminTeacherOrStudent)
from .models import Homework
from .serializers import HomeworkSerializer
from .services import create_homework, update_homework


class HomeworkListCreateAPIView(APIView):

    def get_permissions(self):

        if self.request.method == "GET":
            permission_classes = [IsAdminTeacherOrStudent]
        else:
            # Only Admin and Teacher can create homework.
            permission_classes = [IsAdminOrTeacher]

        return [permission() for permission in permission_classes]

    def get(self, request):

        if request.user.role == User.ADMIN:

            # Admin can view all homework.
            homeworks = Homework.objects.all()

        elif request.user.role == User.TEACHER:

            # Teacher can view only their own homework.
            homeworks = Homework.objects.filter(teacher=request.user.teacher)

        else:

            # Student can view homework assigned to their class and section.
            homeworks = Homework.objects.filter(school_class=request.user.student.school_class,
                section=request.user.student.section)

        serializer = HomeworkSerializer(homeworks, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):

        serializer = HomeworkSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        homework = create_homework(serializer.validated_data)

        return Response(HomeworkSerializer(homework).data, status=status.HTTP_201_CREATED)


class HomeworkDetailAPIView(APIView):

    def get_permissions(self):

        if self.request.method == "GET":
            permission_classes = [IsAdminTeacherOrStudent]

        elif self.request.method in ["PUT", "PATCH"]:
            # Only Admin and Teacher can update homework.
            permission_classes = [IsAdminOrTeacher]

        else:
            # Only Admin and Teacher can delete homework.
            permission_classes = [IsAdminOrTeacher]

        return [permission() for permission in permission_classes]

    def get(self, request, pk):

        homework = get_object_or_404(Homework, pk=pk)

        if request.user.role == User.TEACHER:

            # Teacher can view only their own homework.
            if homework.teacher != request.user.teacher:
                raise PermissionDenied("You cannot view this homework.")

        elif request.user.role == User.STUDENT:

            # Student can view only homework assigned to their class and section.
            if (homework.school_class != request.user.student.school_class 
                or homework.section != request.user.student.section):
                raise PermissionDenied("You cannot view this homework.")

        serializer = HomeworkSerializer(homework)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):

        homework = get_object_or_404(Homework, pk=pk)
        if request.user.role == User.TEACHER:

            # Teacher can update only their own homework.
            if homework.teacher != request.user.teacher:
                raise PermissionDenied("You cannot update this homework.")
        serializer = HomeworkSerializer(homework, data=request.data)
        serializer.is_valid(raise_exception=True)
        homework = update_homework(homework, serializer.validated_data)

        return Response(HomeworkSerializer(homework).data, status=status.HTTP_200_OK)

    def patch(self, request, pk):

        homework = get_object_or_404(Homework, pk=pk)

        if request.user.role == User.TEACHER:

            # Teacher can update only their own homework.
            if homework.teacher != request.user.teacher:
                raise PermissionDenied("You cannot update this homework.")

        serializer = HomeworkSerializer(homework, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        homework = update_homework(homework, serializer.validated_data)

        return Response(HomeworkSerializer(homework).data, status=status.HTTP_200_OK)

    def delete(self, request, pk):

        homework = get_object_or_404(Homework, pk=pk)

        if request.user.role == User.TEACHER:

            # Teacher can delete only their own homework.
            if homework.teacher != request.user.teacher:
                raise PermissionDenied("You cannot delete this homework.")

        homework.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)