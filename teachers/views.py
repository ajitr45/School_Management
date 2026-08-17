from django.shortcuts import render, get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import TeacherSerializer, TeacherAssignmentSerializer, TeacherListSerializer, TeacherDetailSerializer, TeacherUpdateSerializer
from .services import assign_teacher, create_teacher, update_teacher
from .models import Teacher
from accounts.permissions import IsAdmin, IsAdminTeacherOrStudent, IsAdminOrTeacher


class TeacherCreateAPIView(APIView):
    
    permission_classes = [IsAdmin]

    def post(self, request):

        serializer = TeacherSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = create_teacher(serializer.validated_data)
        return Response(data,status=status.HTTP_201_CREATED)
    
    
class TeacherAssignmentAPIView(APIView):
    
    permission_classes = [IsAdminOrTeacher]

    def post(self, request):
    
        serializer = TeacherAssignmentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = assign_teacher(serializer.validated_data)
        return Response(data,status=status.HTTP_201_CREATED)
    

class TeacherListAPIView(APIView):
    
    permission_classes = [IsAdminTeacherOrStudent]

    def get(self, request):
        teachers = Teacher.objects.all()
        serializer = TeacherListSerializer(teachers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class TeacherDetailAPIView(APIView):

    def get_permissions(self):
        
        if self.request.method == "GET":
            permission_classes = [IsAdminTeacherOrStudent]
        else:
            permission_classes = [IsAdmin]

        return [permission() for permission in permission_classes]

    def get(self, request, pk):

        teacher = get_object_or_404(Teacher, pk=pk)
        serializer = TeacherDetailSerializer(teacher)
        return Response(serializer.data, status=status.HTTP_200_OK)


    def patch(self, request, pk):

        teacher = get_object_or_404(Teacher, pk=pk)
        serializer = TeacherUpdateSerializer(teacher,data=request.data,partial=True)
        serializer.is_valid(raise_exception=True)
        teacher = update_teacher(teacher, serializer.validated_data)
        serializer = TeacherDetailSerializer(teacher)

        return Response(serializer.data, status=status.HTTP_200_OK)
    
