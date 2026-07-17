from django.shortcuts import render, get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import TeacherSerializer, TeacherAssignmentSerializer, TeacherListSerializer, TeacherDetailSerializer
from .services import assign_teacher, create_teacher
from .models import Teacher


class TeacherCreateAPIView(APIView):

    def post(self, request):

        serializer = TeacherSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = create_teacher(serializer.validated_data)
        return Response(data,status=status.HTTP_201_CREATED)
    
    
class TeacherAssignmentAPIView(APIView):

    def post(self, request):
        
        print(request.data)

        serializer = TeacherAssignmentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = assign_teacher(serializer.validated_data)
        return Response(data,status=status.HTTP_201_CREATED)
    

class TeacherListAPIView(APIView):

    def get(self, request):
        teachers = Teacher.objects.all()
        serializer = TeacherListSerializer(teachers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class TeacherDetailAPIView(APIView):

    def get(self, request, pk):
        
        print("teacher id :", pk)

        teacher = get_object_or_404(Teacher,pk=pk)

        serializer = TeacherDetailSerializer(teacher)

        return Response(serializer.data, status=status.HTTP_200_OK)