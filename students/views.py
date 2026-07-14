from rest_framework import mixins, viewsets
from .models import Student
from .serializers import StudentSerializer


class StudentViewSet( mixins.ListModelMixin, mixins.UpdateModelMixin,viewsets.GenericViewSet,mixins.RetrieveModelMixin,):

    queryset = Student.objects.all()
    serializer_class = StudentSerializer