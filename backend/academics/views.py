from rest_framework import status
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from accounts.permissions import IsAdmin, IsAdminTeacherOrStudent
from .models import SchoolClass, Section, Subject
from .serializers import ( SchoolClassSerializer, SectionSerializer, SubjectSerializer)


class SchoolClassViewSet(ModelViewSet):

    queryset = SchoolClass.objects.all()
    serializer_class = SchoolClassSerializer

    def get_permissions(self):

        if self.action == "list":
            permission_classes = [AllowAny]

        elif self.action == "retrieve":
            permission_classes = [IsAdminTeacherOrStudent]

        else:
            permission_classes = [IsAdmin]

        return [permission() for permission in permission_classes]

    def destroy(self, request):

        return Response({"detail": "Deleting a school class is not allowed."}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


class SectionViewSet(ModelViewSet):

    queryset = Section.objects.all()
    serializer_class = SectionSerializer

    def get_permissions(self):

        if self.action in ["list", "retrieve"]:
            permission_classes = [IsAdminTeacherOrStudent]

        elif self.action in ["create", "update", "partial_update"]:
            permission_classes = [IsAdmin]

        else:
            permission_classes = [IsAdmin]

        return [permission() for permission in permission_classes]

    def destroy(self, request):

        return Response({"detail": "Deleting a section is not allowed."}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


class SubjectViewSet(ModelViewSet):

    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer

    def get_permissions(self):

        if self.action in ["list", "retrieve"]:
            permission_classes = [IsAdminTeacherOrStudent]

        elif self.action in ["create", "update", "partial_update"]:
            permission_classes = [IsAdmin]

        else:
            permission_classes = [IsAdmin]

        return [permission() for permission in permission_classes]

    def destroy(self, request):

        return Response({"detail": "Deleting a subject is not allowed."}, status=status.HTTP_405_METHOD_NOT_ALLOWED,)
