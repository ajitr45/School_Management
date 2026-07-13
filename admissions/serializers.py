from rest_framework import serializers
from academics.models import Section
from .models import Admission

class AdmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admission
        fields = '__all__'
        
        read_only_fields = [
            "application_no",
            "status",
            "applied_date"
        ]
        

class ApproveAdmissionSerializer(serializers.Serializer):
    section = serializers.PrimaryKeyRelatedField(queryset=Section.objects.all())