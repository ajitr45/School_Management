from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import PermissionDenied
from accounts.models import User
from accounts.permissions import (IsAdminOrTeacher, IsAdminTeacherOrStudent,)
from teachers.models import TeacherAssignment
from .models import Chapter, StudyMaterial
from .serializers import (ChapterSerializer, StudyMaterialSerializer,)
from .services import (create_chapter, update_chapter, create_study_material, update_study_material)


class ChapterListCreateAPIView(APIView):

    def get_permissions(self):

        if self.request.method == "GET":
            permission_classes = [IsAdminTeacherOrStudent]
        else:
            permission_classes = [IsAdminOrTeacher]

        return [permission() for permission in permission_classes]

    def get(self, request):

        chapters = Chapter.objects.all()
        serializer = ChapterSerializer( chapters, many=True)

        return Response( serializer.data, status=status.HTTP_200_OK)

    def post(self, request):

        serializer = ChapterSerializer( data=request.data)
        serializer.is_valid(raise_exception=True)
        
        chapter = create_chapter(serializer.validated_data)

        return Response(ChapterSerializer(chapter).data, status=status.HTTP_201_CREATED)


class ChapterDetailAPIView(APIView):

    def get_permissions(self):

        if self.request.method == "GET":
            permission_classes = [IsAdminTeacherOrStudent]
        else:
            permission_classes = [IsAdminOrTeacher]

        return [permission() for permission in permission_classes]

    def get(self, request, pk):

        chapter = get_object_or_404( Chapter, pk=pk)
        serializer = ChapterSerializer(chapter)

        return Response( serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):

        chapter = get_object_or_404(Chapter, pk=pk)
        serializer = ChapterSerializer(chapter, data=request.data)
        serializer.is_valid(raise_exception=True)
        chapter = update_chapter(chapter, serializer.validated_data)

        return Response(ChapterSerializer(chapter).data, status=status.HTTP_200_OK)

    def patch(self, request, pk):

        chapter = get_object_or_404( Chapter, pk=pk)
        serializer = ChapterSerializer( chapter, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        chapter = update_chapter( chapter, serializer.validated_data)

        return Response(ChapterSerializer(chapter).data, status=status.HTTP_200_OK)

    def delete(self, request, pk):

        chapter = get_object_or_404(Chapter, pk=pk)

        chapter.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)


class StudyMaterialListCreateAPIView(APIView):

    def get_permissions(self):

        if self.request.method == "GET":
            permission_classes = [IsAdminTeacherOrStudent]
        else:
            permission_classes = [IsAdminOrTeacher]

        return [permission() for permission in permission_classes]

    def get(self, request):

        study_materials = StudyMaterial.objects.all()

        if request.user.role == User.STUDENT:

            study_materials = study_materials.filter(chapter__school_class=request.user.student.school_class)

        elif request.user.role == User.TEACHER:

            assignments = TeacherAssignment.objects.filter(teacher=request.user.teacher)
            study_materials = study_materials.filter(chapter__school_class__in=assignments.values("school_class"),
                chapter__subject__in=assignments.values("subject"))

        serializer = StudyMaterialSerializer( study_materials, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):

        serializer = StudyMaterialSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        study_material = create_study_material(serializer.validated_data,request)

        return Response(StudyMaterialSerializer(study_material).data,
            status=status.HTTP_201_CREATED
        )


class StudyMaterialDetailAPIView(APIView):

    def get_permissions(self):

        if self.request.method == "GET":
            permission_classes = [IsAdminTeacherOrStudent]
        else:
            permission_classes = [IsAdminOrTeacher]

        return [permission() for permission in permission_classes]

    def get(self, request, pk):

        study_material = get_object_or_404(StudyMaterial, pk=pk)

        if request.user.role == User.TEACHER:

            teacher = request.user.teacher
            chapter = study_material.chapter

            is_assigned = TeacherAssignment.objects.filter(
                teacher=teacher,
                school_class=chapter.school_class,
                subject=chapter.subject,
            ).exists()

            if not is_assigned:
                raise PermissionDenied("You cannot view this study material.")

        elif request.user.role == User.STUDENT:

            if (study_material.chapter.school_class != request.user.student.school_class):
                raise PermissionDenied("You cannot view this study material.")

        serializer = StudyMaterialSerializer(study_material)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):

        study_material = get_object_or_404(StudyMaterial, pk=pk)

        if request.user.role == User.TEACHER:

            teacher = request.user.teacher
            chapter = study_material.chapter

            is_assigned = TeacherAssignment.objects.filter(
                teacher=teacher,
                school_class=chapter.school_class,
                subject=chapter.subject,
            ).exists()

            if not is_assigned:
                raise PermissionDenied("You cannot update this study material.")

        serializer = StudyMaterialSerializer(study_material, data=request.data)
        serializer.is_valid(raise_exception=True)
        study_material = update_study_material( request, study_material, serializer.validated_data)

        return Response(StudyMaterialSerializer(study_material).data,
            status=status.HTTP_200_OK
        )

    def patch(self, request, pk):

        study_material = get_object_or_404(StudyMaterial, pk=pk)

        if request.user.role == User.TEACHER:

            teacher = request.user.teacher
            chapter = study_material.chapter

            is_assigned = TeacherAssignment.objects.filter(
                teacher=teacher,
                school_class=chapter.school_class,
                subject=chapter.subject,
            ).exists()

            if not is_assigned:
                raise PermissionDenied("You cannot update this study material.")

        serializer = StudyMaterialSerializer( study_material, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        study_material = update_study_material(request, study_material, serializer.validated_data)

        return Response(StudyMaterialSerializer(study_material).data, status=status.HTTP_200_OK)

    def delete(self, request, pk):

        study_material = get_object_or_404(StudyMaterial, pk=pk)

        if request.user.role == User.TEACHER:

            teacher = request.user.teacher
            chapter = study_material.chapter

            is_assigned = TeacherAssignment.objects.filter(
                teacher=teacher,
                school_class=chapter.school_class,
                subject=chapter.subject,
            ).exists()

            if not is_assigned:
                raise PermissionDenied("You cannot delete this study material.")

        study_material.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)