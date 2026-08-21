from .models import Chapter, StudyMaterial
from rest_framework import serializers


class ChapterSerializer(serializers.ModelSerializer):
    
    
    class Meta:
        model= Chapter
        fields = "__all__"
        read_only_fields = ["created_at"]
        
        
class StudyMaterialSerializer(serializers.ModelSerializer):
    
    class Meta:
        
        model = StudyMaterial
        fields = "__all__"
        read_only_fields = ["created_at"]
    
    