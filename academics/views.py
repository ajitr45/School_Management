
from rest_framework.viewsets import ModelViewSet
from .models import SchoolClass, Section, Subject
from .serializers import SchoolClassSerializer, SectionSerializer, SubjectSerializer

# Create your views here.


class SchoolClassViewSet(ModelViewSet):
    queryset = SchoolClass.objects.all()
    serializer_class = SchoolClassSerializer

class SectionViewSet(ModelViewSet):
    queryset = Section.objects.all()
    serializer_class = SectionSerializer

class SubjectViewSet(ModelViewSet):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer