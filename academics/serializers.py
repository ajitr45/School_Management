from rest_framework import serializers
from .models import SchoolClass, Section, Subject


class SchoolClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchoolClass
        fields = "__all__"
        
        

class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = "__all__"
        
        
        
class SubjectSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Subject
        fields = "__all__"
        