from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from accounts.models import User
from accounts.permissions import IsAdminOrTeacher, IsAdminTeacherOrStudent
from .models import Notice
from .serializers import NoticeSerializer
from .services import create_notice, update_notice


class NoticeListCreateAPIView(APIView):

    def get_permissions(self):

        if self.request.method == "GET":
            permission_classes = [IsAdminTeacherOrStudent]
        else:
            permission_classes = [IsAdminOrTeacher]

        return [permission() for permission in permission_classes]

    def get(self, request):

        notices = Notice.objects.all()

        # Students can see only notices meant for everyone,
        # students, or their own class.
        if request.user.role == User.STUDENT:

            student = request.user.student

            notices = notices.filter(audience__in=["ALL", "STUDENT"]) | notices.filter(audience="CLASS",
                school_class=student.school_class)

        # Teachers can see notices meant for everyone or teachers.
        elif request.user.role == User.TEACHER:

            notices = notices.filter(audience__in=["ALL", "TEACHER"])

        serializer = NoticeSerializer(notices.distinct(), many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):

        serializer = NoticeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        notice = create_notice(serializer.validated_data)

        return Response(NoticeSerializer(notice).data, status=status.HTTP_201_CREATED)


class NoticeDetailAPIView(APIView):

    def get_permissions(self):

        if self.request.method == "GET":
            permission_classes = [IsAdminTeacherOrStudent]
        else:
            permission_classes = [IsAdminOrTeacher]

        return [permission() for permission in permission_classes]

    def get(self, request, pk):

        notice = get_object_or_404(Notice, pk=pk)

        # Check whether the student is allowed to view this notice.
        if request.user.role == User.STUDENT:

            student = request.user.student

            is_allowed = (notice.audience == "ALL" or notice.audience == "STUDENT"
                or (notice.audience == "CLASS" and notice.school_class == student.school_class))

            if not is_allowed:
                raise PermissionDenied("You cannot view this notice.")

        # Teachers can only view ALL and TEACHER notices.
        elif request.user.role == User.TEACHER:

            if notice.audience not in ["ALL", "TEACHER"]:
                raise PermissionDenied("You cannot view this notice.")

        serializer = NoticeSerializer(notice)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):

        notice = get_object_or_404(Notice, pk=pk,)
        serializer = NoticeSerializer(notice, data=request.data,)
        serializer.is_valid(raise_exception=True)
        notice = update_notice(notice, serializer.validated_data)

        return Response(NoticeSerializer(notice).data, status=status.HTTP_200_OK)

    def patch(self, request, pk):

        notice = get_object_or_404(Notice, pk=pk)

        serializer = NoticeSerializer(notice, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        notice = update_notice(notice, serializer.validated_data,)

        return Response(NoticeSerializer(notice).data, status=status.HTTP_200_OK)

    def delete(self, request, pk):

        notice = get_object_or_404(Notice, pk=pk)
        notice.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)