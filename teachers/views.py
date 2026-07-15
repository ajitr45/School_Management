from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import TeacherSerializer, TeacherAssignmentSerializer
from .services import assign_teacher, create_teacher


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