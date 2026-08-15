from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import PermissionDenied
from accounts.models import User
from accounts.permissions import IsAdminOrTeacher, IsAdminTeacherOrStudent
from .models import Chapter, StudyMaterial
from .serializers import ChapterSerializer, StudyMaterialSerializer
from .services import create_chapter, update_chapter, create_study_material, update_study_material


class ChapterListCreateAPIView(APIView):

    def get_permissions(self):

        if self.request.method == "GET":
            # All roles can view chapters.
            permission_classes = [IsAdminTeacherOrStudent]
        else:
            # Only Admin and Teacher can create chapters.
            permission_classes = [IsAdminOrTeacher]

        return [permission() for permission in permission_classes]

    def get(self, request):

        chapters = Chapter.objects.all()
        serializer = ChapterSerializer(chapters, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):

        serializer = ChapterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True,)
        chapter = create_chapter(serializer.validated_data)

        return Response(ChapterSerializer(chapter).data,status=status.HTTP_201_CREATED)


class ChapterDetailAPIView(APIView):

    def get_permissions(self):

        if self.request.method == "GET":
            # All roles can view chapter details.
            permission_classes = [IsAdminTeacherOrStudent]
        else:
            # Only Admin and Teacher can modify chapters.
            permission_classes = [IsAdminOrTeacher]

        return [permission() for permission in permission_classes]

    def get(self, request, pk):

        chapter = get_object_or_404(Chapter, pk=pk,)
        serializer = ChapterSerializer(chapter)
        return Response(serializer.data,status=status.HTTP_200_OK)

    def put(self, request, pk):

        chapter = get_object_or_404(Chapter, pk=pk)
        serializer = ChapterSerializer(chapter, data=request.data)
        serializer.is_valid(raise_exception=True)

        chapter = update_chapter(chapter, serializer.validated_data )
        return Response(ChapterSerializer(chapter).data, status=status.HTTP_200_OK )

    def patch(self, request, pk):

        chapter = get_object_or_404(Chapter, pk=pk)
        serializer = ChapterSerializer(chapter, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        chapter = update_chapter(chapter, serializer.validated_data)

        return Response(ChapterSerializer(chapter).data, status=status.HTTP_200_OK)

    def delete(self, request, pk):

        chapter = get_object_or_404( Chapter, pk=pk,)

        chapter.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)


class StudyMaterialListCreateAPIView(APIView):

    def get_permissions(self):

        if self.request.method == "GET":
            # All roles can view study materials.
            permission_classes = [IsAdminTeacherOrStudent]
        else:
            # Only Admin and Teacher can upload study materials.
            permission_classes = [IsAdminOrTeacher]

        return [permission() for permission in permission_classes]

    def get(self, request):

        study_materials = StudyMaterial.objects.all()

        if request.user.role == User.STUDENT:
            
            study_materials = study_materials.filter(chapter__school_class=request.user.student.school_class)

        serializer = StudyMaterialSerializer(study_materials, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)



    def post(self, request):

        serializer = StudyMaterialSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        study_material = create_study_material(serializer.validated_data)

        return Response(StudyMaterialSerializer(study_material).data, status=status.HTTP_201_CREATED)


class StudyMaterialDetailAPIView(APIView):

    def get_permissions(self):

        if self.request.method == "GET":
            # All roles can view study material details.
            permission_classes = [IsAdminTeacherOrStudent]
        else:
            # Only Admin and Teacher can modify study materials.
            permission_classes = [IsAdminOrTeacher]

        return [permission() for permission in permission_classes]

    def get(self, request, pk):

        study_material = get_object_or_404(StudyMaterial, pk=pk)

        # Students can view only materials from their own class.
        if request.user.role == User.STUDENT:

            if (study_material.chapter.school_class != request.user.student.school_class):
                raise PermissionDenied("You cannot view this study material.")

        serializer = StudyMaterialSerializer(study_material)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):

        study_material = get_object_or_404(StudyMaterial, pk=pk)
        serializer = StudyMaterialSerializer(study_material, data=request.data)
        serializer.is_valid(raise_exception=True)
        study_material = update_study_material(study_material, serializer.validated_data,)
        return Response(StudyMaterialSerializer(study_material).data, status=status.HTTP_200_OK)

    def patch(self, request, pk):

        study_material = get_object_or_404(StudyMaterial, pk=pk,)
        serializer = StudyMaterialSerializer(study_material, data=request.data, partial=True,)
        serializer.is_valid(raise_exception=True)
        study_material = update_study_material(study_material, serializer.validated_data)

        return Response(StudyMaterialSerializer(study_material).data, status=status.HTTP_200_OK)

    def delete(self, request, pk):

        study_material = get_object_or_404(StudyMaterial, pk=pk)

        study_material.delete()

        return Response( status=status.HTTP_204_NO_CONTENT)