from django.db.models import Q
from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import User
from accounts.permissions import IsAdmin, IsAdminTeacherOrStudent
from students.models import Student
from teachers.models import TeacherAssignment

from .models import Exam, ExamSubject, StudentResult
from .report_serializers import ReportCardSerializer
from .serializers import (
    ExamSerializer,
    ExamSubjectSerializer,
    StudentResultSerializer,
)
from .services import (
    create_exam,
    update_exam,
    create_exam_subject,
    update_exam_subject,
    create_student_result,
    update_student_result,
    generate_report_card,
)


class ExamListCreateApiView(APIView):

    def get_permissions(self):

        if self.request.method == "GET":
            permission_classes = [IsAdminTeacherOrStudent]
        else:
            permission_classes = [IsAdmin]

        return [permission() for permission in permission_classes]

    def get(self, request):

        exams = Exam.objects.all()

        # Student can see only exams of their class.
        if request.user.role == User.STUDENT:

            exams = exams.filter(
                school_class=request.user.student.school_class
            )

        # Teacher can see exams for their assigned classes.
        elif request.user.role == User.TEACHER:

            assignments = TeacherAssignment.objects.filter(
                teacher=request.user.teacher
            )

            exams = exams.filter(
                school_class__in=assignments.values("school_class")
            )

        serializer = ExamSerializer(exams, many=True)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    def post(self, request):

        serializer = ExamSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        exam = create_exam(serializer.validated_data)

        return Response(
            ExamSerializer(exam).data,
            status=status.HTTP_201_CREATED
        )


class ExamDetailApiView(APIView):

    def get_permissions(self):

        if self.request.method == "GET":
            permission_classes = [IsAdminTeacherOrStudent]
        else:
            permission_classes = [IsAdmin]

        return [permission() for permission in permission_classes]

    def get(self, request, pk):

        exam = get_object_or_404(
            Exam,
            pk=pk
        )

        # Teacher can view exams of their assigned classes.
        if request.user.role == User.TEACHER:

            is_assigned = TeacherAssignment.objects.filter(
                teacher=request.user.teacher,
                school_class=exam.school_class
            ).exists()

            if not is_assigned:
                raise PermissionDenied(
                    "You cannot view this exam."
                )

        # Student can view only exams of their class.
        elif request.user.role == User.STUDENT:

            if exam.school_class != request.user.student.school_class:
                raise PermissionDenied(
                    "You cannot view this exam."
                )

        serializer = ExamSerializer(exam)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    def put(self, request, pk):

        exam = get_object_or_404(
            Exam,
            pk=pk
        )

        serializer = ExamSerializer(
            exam,
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        exam = update_exam(
            exam,
            serializer.validated_data
        )

        return Response(
            ExamSerializer(exam).data,
            status=status.HTTP_200_OK
        )

    def patch(self, request, pk):

        exam = get_object_or_404(
            Exam,
            pk=pk
        )

        serializer = ExamSerializer(
            exam,
            data=request.data,
            partial=True
        )

        serializer.is_valid(raise_exception=True)

        exam = update_exam(
            exam,
            serializer.validated_data
        )

        return Response(
            ExamSerializer(exam).data,
            status=status.HTTP_200_OK
        )

    def delete(self, request, pk):

        exam = get_object_or_404(
            Exam,
            pk=pk
        )

        exam.delete()

        return Response(
            status=status.HTTP_204_NO_CONTENT
        )


class ExamSubjectListCreateAPIView(APIView):

    def get_permissions(self):

        if self.request.method == "GET":
            permission_classes = [IsAdminTeacherOrStudent]
        else:
            permission_classes = [IsAdmin]

        return [permission() for permission in permission_classes]

    def get(self, request):

        exam_subjects = ExamSubject.objects.all()

        # Student can see only subjects of exams
        # belonging to their class.
        if request.user.role == User.STUDENT:

            exam_subjects = exam_subjects.filter(
                exam__school_class=request.user.student.school_class
            )

        # Teacher can see only their assigned
        # class + subject combinations.
        elif request.user.role == User.TEACHER:

            assignments = TeacherAssignment.objects.filter(
                teacher=request.user.teacher
            )

            query = Q()

            for assignment in assignments:
                query |= Q(
                    exam__school_class=assignment.school_class,
                    subject=assignment.subject
                )

            exam_subjects = exam_subjects.filter(query)

        serializer = ExamSubjectSerializer(
            exam_subjects,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    def post(self, request):

        serializer = ExamSubjectSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        exam_subject = create_exam_subject(
            serializer.validated_data
        )

        return Response(
            ExamSubjectSerializer(exam_subject).data,
            status=status.HTTP_201_CREATED
        )


class ExamSubjectDetailAPIView(APIView):

    def get_permissions(self):

        if self.request.method == "GET":
            permission_classes = [IsAdminTeacherOrStudent]
        else:
            permission_classes = [IsAdmin]

        return [permission() for permission in permission_classes]

    def get(self, request, pk):

        exam_subject = get_object_or_404(
            ExamSubject,
            pk=pk
        )

        # Student can see subjects of exams
        # belonging to their class.
        if request.user.role == User.STUDENT:

            if (
                exam_subject.exam.school_class
                != request.user.student.school_class
            ):
                raise PermissionDenied(
                    "You cannot view this exam subject."
                )

        # Teacher can see only their assigned
        # class + subject.
        elif request.user.role == User.TEACHER:

            is_assigned = TeacherAssignment.objects.filter(
                teacher=request.user.teacher,
                school_class=exam_subject.exam.school_class,
                subject=exam_subject.subject
            ).exists()

            if not is_assigned:
                raise PermissionDenied(
                    "You cannot view this exam subject."
                )

        serializer = ExamSubjectSerializer(
            exam_subject
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    def put(self, request, pk):

        exam_subject = get_object_or_404(
            ExamSubject,
            pk=pk
        )

        serializer = ExamSubjectSerializer(
            exam_subject,
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        exam_subject = update_exam_subject(
            exam_subject,
            serializer.validated_data
        )

        return Response(
            ExamSubjectSerializer(exam_subject).data,
            status=status.HTTP_200_OK
        )

    def patch(self, request, pk):

        exam_subject = get_object_or_404(
            ExamSubject,
            pk=pk
        )

        serializer = ExamSubjectSerializer(
            exam_subject,
            data=request.data,
            partial=True
        )

        serializer.is_valid(
            raise_exception=True
        )

        exam_subject = update_exam_subject(
            exam_subject,
            serializer.validated_data
        )

        return Response(
            ExamSubjectSerializer(exam_subject).data,
            status=status.HTTP_200_OK
        )

    def delete(self, request, pk):

        exam_subject = get_object_or_404(
            ExamSubject,
            pk=pk
        )

        exam_subject.delete()

        return Response(
            status=status.HTTP_204_NO_CONTENT
        )


class StudentResultListCreateApiView(APIView):

    def get_permissions(self):

        if self.request.method == "GET":
            permission_classes = [IsAdminTeacherOrStudent]
        else:
            permission_classes = [IsAdmin]

        return [permission() for permission in permission_classes]

    def get(self, request):

        student_results = StudentResult.objects.all()

        # Student can see only their own results.
        if request.user.role == User.STUDENT:

            student_results = student_results.filter(
                student=request.user.student
            )

        # Teacher can see results only for their
        # assigned class + subject combinations.
        elif request.user.role == User.TEACHER:

            assignments = TeacherAssignment.objects.filter(
                teacher=request.user.teacher
            )

            query = Q()

            for assignment in assignments:
                query |= Q(
                    student__school_class=assignment.school_class,
                    exam_subject__subject=assignment.subject
                )

            student_results = student_results.filter(query)

        serializer = StudentResultSerializer(
            student_results,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    def post(self, request):

        serializer = StudentResultSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        student_result = create_student_result(
            serializer.validated_data
        )

        return Response(
            StudentResultSerializer(student_result).data,
            status=status.HTTP_201_CREATED
        )


class StudentResultDetailAPIView(APIView):

    def get_permissions(self):

        if self.request.method == "GET":
            permission_classes = [IsAdminTeacherOrStudent]
        else:
            permission_classes = [IsAdmin]

        return [permission() for permission in permission_classes]

    def get(self, request, pk):

        student_result = get_object_or_404(
            StudentResult,
            pk=pk
        )

        # Student can view only their own result.
        if request.user.role == User.STUDENT:

            if student_result.student != request.user.student:
                raise PermissionDenied("You cannot view this result.")

        # Teacher can view only results of their assigned class + subject.
        elif request.user.role == User.TEACHER:

            is_assigned = TeacherAssignment.objects.filter(
                teacher=request.user.teacher,
                school_class=student_result.student.school_class,
                subject=student_result.exam_subject.subject
            ).exists()

            if not is_assigned:
                raise PermissionDenied("You cannot view this result.")

        serializer = StudentResultSerializer(student_result)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):

        student_result = get_object_or_404(StudentResult, pk=pk)
        serializer = StudentResultSerializer(student_result, data=request.data)
        serializer.is_valid(raise_exception=True)
        student_result = update_student_result(student_result, serializer.validated_data)

        return Response(StudentResultSerializer(student_result).data, status=status.HTTP_200_OK)

    def patch(self, request, pk):

        student_result = get_object_or_404(StudentResult, pk=pk)
        serializer = StudentResultSerializer( student_result, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        student_result = update_student_result(student_result, serializer.validated_data)

        return Response(StudentResultSerializer(student_result).data, status=status.HTTP_200_OK)

    def delete(self, request, pk):

        student_result = get_object_or_404(StudentResult, pk=pk)
        student_result.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ReportCardAPIView(APIView):

    permission_classes = [IsAdminTeacherOrStudent]

    def get(self, request, student_id, exam_id):

        student = get_object_or_404(Student, id=student_id)
        exam = get_object_or_404( Exam, id=exam_id)

        # Teacher can view report cards only for their assigned class.
        if request.user.role == User.TEACHER:

            is_assigned = TeacherAssignment.objects.filter( teacher=request.user.teacher, school_class=student.school_class).exists()

            if not is_assigned:
                raise PermissionDenied("You cannot view this student's report card.")

        # Student can view only their own report card.
        elif request.user.role == User.STUDENT:

            if student != request.user.student:
                raise PermissionDenied("You cannot view another student's report card.")

        # Student and exam must belong to the same class.
        if student.school_class != exam.school_class:
            raise PermissionDenied("This exam does not belong to the student's class.")

        report = generate_report_card(student_id, exam_id)
        serializer = ReportCardSerializer(report)

        return Response(serializer.data, status=status.HTTP_200_OK)