from rest_framework import mixins, viewsets
from rest_framework.response import Response
from rest_framework import status
from accounts.models import User
from accounts.permissions import IsAdmin, IsAdminTeacherOrStudent
from .models import Student
from .serializers import StudentSerializer


class StudentViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, viewsets.GenericViewSet):

    queryset = Student.objects.all()
    serializer_class = StudentSerializer

    def get_permissions(self):

        # Admin, Teacher and Student can view student information.
        if self.action in ["list", "retrieve"]:
            permission_classes = [IsAdminTeacherOrStudent]

        # Only Admin can update student information.
        # 
        elif self.action in ["update", "partial_update"]:
            permission_classes = [IsAdmin]

        else:
            permission_classes = [IsAdmin]

        return [permission() for permission in permission_classes]

    def get_queryset(self):
        
        if self.request.user.role == User.STUDENT:
            
            return Student.objects.filter(user = self.request.user)
        
        # Admin and Teacher can access all student records.
        return Student.objects.all()

    def retrieve(self, request, *args, **kwargs):

        student = self.get_object()

        serializer = self.get_serializer(student)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def list(self, request, *args, **kwargs):

        students = self.get_queryset()
        serializer = self.get_serializer(students, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
