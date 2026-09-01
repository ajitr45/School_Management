from rest_framework import serializers
from .models import Homework


class HomeworkSerializer(serializers.ModelSerializer):
    
    class_name = serializers.CharField(source = "school_class.name", read_only =True,)
    section_name = serializers.CharField(source ="section.name",read_only =True)
    subject_name = serializers.CharField(source = "subject.name", read_only = True)
    teacher_name = serializers.CharField(source = 'teacher.full_name', read_only =True)
    
    
    class Meta: 
        
        model = Homework
        fields ="__all__"
        
        read_only_fields = (
            "teacher",
            "created_at",
            "updated_at",
        )
        