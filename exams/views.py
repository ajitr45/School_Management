from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Exam, ExamSubject, StudentResult
from .serializers import  ExamSerializer, ExamSubjectSerializer, StudentResultSerializer
from .services import created_exam, updated_exam, created_exam_subject, updated_exam_subject, created_student_result,updated_student_result, generate_report_card
from .report_serializers import ReportCardSerializer



class ExamListCreateApiView(APIView):

    def get(self, request):

        exams = Exam.objects.all()
        serializer = ExamSerializer(exams, many=True)
        return Response(serializer.data)

    def post(self, request):

        serializer = ExamSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        exam = created_exam(serializer.validated_data)
        return Response( ExamSerializer(exam).data, status=status.HTTP_201_CREATED,)


class ExamDetailApiView(APIView):

    def get(self, request, pk):

        exam = get_object_or_404(Exam, pk=pk)
        serializer = ExamSerializer(exam)
        return Response(serializer.data)

    def put(self, request, pk):

        exam = get_object_or_404(Exam, pk=pk)
        serializer = ExamSerializer(exam, data=request.data,)
        serializer.is_valid(raise_exception=True)
        exam = updated_exam(exam,serializer.validated_data,)
        return Response( ExamSerializer(exam).data, status=status.HTTP_200_OK,)

    def patch(self, request, pk):

        exam = get_object_or_404(Exam, pk=pk)
        serializer = ExamSerializer( exam, data=request.data, partial=True,)
        serializer.is_valid(raise_exception=True)
        exam = updated_exam( exam, serializer.validated_data,)
        return Response( ExamSerializer(exam).data, status=status.HTTP_200_OK,)

    def delete(self, request, pk):

        exam = get_object_or_404(Exam, pk=pk)
        exam.delete()

        return Response({"message": "Exam deleted successfully."},
            status=status.HTTP_204_NO_CONTENT,
        )



class ExamSubjectListCreateAPIView(APIView):

    def get(self, request):

        exam_subjects = ExamSubject.objects.all()
        serializer = ExamSubjectSerializer( exam_subjects, many=True,)
        return Response(serializer.data)

    def post(self, request):

        serializer = ExamSubjectSerializer(data=request.data,)
        serializer.is_valid(raise_exception=True)
        exam_subject = created_exam_subject(serializer.validated_data,)
        return Response( ExamSubjectSerializer(exam_subject).data, status=status.HTTP_201_CREATED,)


class ExamSubjectDetailAPIView(APIView):

    def get(self, request, pk):

        exam_subject = get_object_or_404( ExamSubject, pk=pk,)
        serializer = ExamSubjectSerializer(exam_subject,)
        return Response(serializer.data)

    def put(self, request, pk):

        exam_subject = get_object_or_404( ExamSubject, pk=pk,)
        serializer = ExamSubjectSerializer( exam_subject, data=request.data,)
        serializer.is_valid(raise_exception=True)
        exam_subject = updated_exam_subject( exam_subject, serializer.validated_data,)
        return Response( ExamSubjectSerializer(exam_subject).data, status=status.HTTP_200_OK,)

    def patch(self, request, pk):

        exam_subject = get_object_or_404( ExamSubject, pk=pk,)
        serializer = ExamSubjectSerializer( exam_subject, data=request.data, partial=True,)
        serializer.is_valid(raise_exception=True)
        exam_subject = updated_exam_subject( exam_subject, serializer.validated_data,)
        return Response( ExamSubjectSerializer(exam_subject).data, status=status.HTTP_200_OK,)

    def delete(self, request, pk):

        exam_subject = get_object_or_404(ExamSubject,pk=pk,)
        exam_subject.delete()

        return Response(
            {"message": "Exam Subject deleted successfully."},
            status=status.HTTP_204_NO_CONTENT,
        )


class StudentResultListCreateApiView(APIView):

    def get(self, request):

        student_results = StudentResult.objects.all()
        serializer = StudentResultSerializer( student_results, many=True,)
        return Response(serializer.data)

    def post(self, request):

        serializer = StudentResultSerializer(data=request.data,)
        serializer.is_valid(raise_exception=True)
        student_result = created_student_result(serializer.validated_data,)

        return Response( StudentResultSerializer(student_result).data, status=status.HTTP_201_CREATED,)


class StudentResultDetailAPIView(APIView):

    def get(self, request, pk):

        student_result = get_object_or_404( StudentResult, pk=pk,)
        serializer = StudentResultSerializer(student_result,)
        return Response(serializer.data)

    def put(self, request, pk):

        student_result = get_object_or_404( StudentResult, pk=pk,)
        serializer = StudentResultSerializer( student_result, data=request.data,)
        serializer.is_valid(raise_exception=True)
        student_result = updated_student_result( student_result, serializer.validated_data,)
        return Response( StudentResultSerializer(student_result).data, status=status.HTTP_200_OK)

    def patch(self, request, pk):

        student_result = get_object_or_404( StudentResult, pk=pk,)
        serializer = StudentResultSerializer( student_result, data=request.data, partial=True,)
        serializer.is_valid(raise_exception=True)
        student_result = updated_student_result( student_result, serializer.validated_data,)

        return Response( StudentResultSerializer(student_result).data, status=status.HTTP_200_OK,)

    def delete(self, request, pk):

        student_result = get_object_or_404( StudentResult, pk=pk,)
        student_result.delete()

        return Response({"message": "Student Result deleted successfully."},
            status=status.HTTP_204_NO_CONTENT,
        )
        
class ReportCardAPIView(APIView):

    def get(self, request, student_id, exam_id):

        report = generate_report_card(student_id,exam_id,)
        serializer = ReportCardSerializer(report)
        return Response(serializer.data, status=status.HTTP_200_OK,)