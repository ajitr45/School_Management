from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from .models import Admission
from .serializers import AdmissionSerializer

# Create your views here.

class AdmissionViewSet(ModelViewSet):
    queryset = Admission.objects.all()
    serializer_class = AdmissionSerializer