from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Chapter, StudyMaterial
from .serializers import ChapterSerializer, StudyMaterialSerializer


class ChapterListCreateAPIView(APIView):
    
    def get(self, request):
        
        chapters = Chapter.objects.all()
        serializer = ChapterSerializer(chapters, many= True)
        return Response(serializer.data)


    def post(self, request):
        
        serializer = ChapterSerializer(data= request.data)
        serializer.is_valid(raise_exception=True)
        chapter = Chapter.objects.create(**serializer.validated_data)
        
        return Response(ChapterSerializer(chapter).data, status=status.HTTP_201_CREATED)
        
        
class ChapterDetailAPIView(APIView):
    
    def get(self, request, pk):
        
        chapter = get_object_or_404(Chapter, pk=pk)
        serializer = ChapterSerializer(chapter)
        return Response(serializer.data)
    
    def put(self, request, pk):
        
        chapter = get_object_or_404(Chapter, pk=pk)
        serializer = ChapterSerializer(chapter, data=request.data)
        serializer.is_valid(raise_exception=True)
        
        for field, value in serializer.validated_data.items():
            setattr(chapter, field, value)
            
        chapter.save()
        return Response(serializer.data)
    
    
    def patch(self, request, pk):
        
        chapter = get_object_or_404(Chapter, pk=pk)
        serializer = ChapterSerializer(Chapter, data=request.data, partial= True)
        serializer.is_valid(raise_exception=True)
        
        for field, value in serializer.validated_data.items():
            setattr(chapter, field, value)
            
        chapter.save()
        return Response(ChapterSerializer(chapter).data)
    
    
    def delete(self, request, pk):
        
        chapter = get_object_or_404(Chapter, pk=pk)
        chapter.delete()
        
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    
class StudyMaterialListCreateAPIView(APIView):
    
    def get(self, request):
        
        study_materials = StudyMaterial.objects.all()
        serializer = StudyMaterialSerializer(study_materials, many=True)
        
        return Response(serializer.data)
    
    
    def post(self, request):
        
        serializer = StudyMaterialSerializer(data = request.data)
        serializer.is_valid(raise_exception=True)
        study_material = StudyMaterial.objects.create(**serializer.validated_data)
        return Response(StudyMaterialSerializer(study_material).data, status=status.HTTP_201_CREATED)
    

class StudyMaterialDetailAPIView(APIView):
    
    def get(self, request, pk):
        
        study_material = get_object_or_404(StudyMaterial, pk=pk)
        serializer = StudyMaterialSerializer(study_material)
        return Response(serializer.data)
    
    def put(self, request, pk):
        
        study_material = get_object_or_404(StudyMaterial, pk=pk)
        serializer = StudyMaterialSerializer(study_material, data =request.data)
        serializer.is_valid(raise_exception=True)
        
        for field, value in serializer.validated_data.items():
            setattr(study_material, field, value)
        
        study_material.save()
        return Response(StudyMaterialSerializer(study_material).data)
    
    
    def patch(self, request, pk):
        
        study_material = get_object_or_404(StudyMaterial, pk=pk)
        serializer = StudyMaterialSerializer(study_material, data= request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        
        for field, value in serializer.validated_data.items():
            setattr(study_material, field,value)
            
        study_material.save()
        return Response(StudyMaterialSerializer(study_material).data)
    
    
    def delete(self, request, pk):

        study_material = get_object_or_404(StudyMaterial, pk=pk)
        study_material.delete()
        
        return Response(status=status.HTTP_204_NO_CONTENT)
        
