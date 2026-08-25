from rest_framework import mixins, viewsets
from rest_framework.response import Response
from rest_framework import status

from accounts.models import User
from accounts.permissions import IsAdmin, IsAdminTeacherOrStudent

from .models import Student
from .serializers import StudentSerializer


class StudentViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet
):

    queryset = Student.objects.all()
    serializer_class = StudentSerializer

    def get_permissions(self):

        if self.action in ["list", "retrieve"]:
            permission_classes = [IsAdminTeacherOrStudent]

        elif self.action in ["update", "partial_update"]:
            permission_classes = [IsAdmin]

        else:
            permission_classes = [IsAdmin]

        return [
            permission()
            for permission in permission_classes
        ]

    def get_queryset(self):

        # Student sirf apna record dekh sakta hai
        if self.request.user.role == User.STUDENT:

            return Student.objects.filter(
                user=self.request.user
            )

        # Admin aur Teacher sabhi students dekh sakte hain
        return Student.objects.all()

    def retrieve(self, request, *args, **kwargs):

        student = self.get_object()

        serializer = self.get_serializer(student)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    def list(self, request, *args, **kwargs):

        students = self.get_queryset()

        serializer = self.get_serializer(
            students,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )