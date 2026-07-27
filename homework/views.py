from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Homework
from .serializers import HomeworkSerializer
from .services import create_homework, update_homework

# Create your views here.

class HomeworkListCreateAPIView(APIView):
    
    def get(self, request):
        
        homeworks = Homework.objects.all()
        serializer = HomeworkSerializer(homeworks, many = True)
        return Response(serializer.data)
    
    def post(self, request):
        
        serializer = HomeworkSerializer(data= request.data)
        serializer.is_valid(raise_exception=True)
        homework = create_homework(serializer.validated_data,)
        
        return Response(HomeworkSerializer(homework).data, status=status.HTTP_201_CREATED)
    

class HomeworkDetailAPIView(APIView):
    
    def get(self, request, pk):
        
        homework = get_object_or_404(Homework, pk=pk,)
        serializer = HomeworkSerializer(homework,)
        
        return Response(serializer.data)
    
    
    def put(self, request, pk):
        
        homework = get_object_or_404(Homework, pk=pk)
        serializer = HomeworkSerializer(homework, data= request.data)
        serializer.is_valid(raise_exception=True)
        homework = update_homework(homework, serializer.validated_data,)
        
        return Response(HomeworkSerializer(homework).data, status=status.HTTP_200_OK)
    
    
    def patch(self, request, pk):
        
        homework = get_object_or_404(Homework, pk=pk)
        serializer = HomeworkSerializer(homework, data= request.data, partial = True)
        serializer.is_valid(raise_exception=True)
        homework = update_homework(homework, serializer.validated_data)
        
        return Response(HomeworkSerializer(homework).data,)
    
    
    def delete(self, request, pk):
        
        homework = get_object_or_404(Homework, pk=pk)
        homework.delete()
        
        return Response(
            {
                "message": "Homework deleted successfully"
            }, status=status.HTTP_204_NO_CONTENT,
        )