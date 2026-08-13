from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from accounts.models import User
from accounts.permissions import IsAdminOrTeacher, IsAdminTeacherOrStudent
from .models import  FeeStructure, StudentFee, FeePayment
from .serializers import FeeStructureSerializer, StudentFeeSerializer, FeePaymentSerializer
from .services import  create_fee_structure, update_fee_structure, create_student_fee, update_student_fee, create_fee_payment, update_fee_payment



class FeeStructureListCreateAPIView(APIView):

    def get_permissions(self):

        if self.request.method == "GET":
            permission_classes = [IsAdminTeacherOrStudent]
        else:
            permission_classes = [IsAdminOrTeacher]

        return [ permission() for permission in permission_classes]

    def get(self, request):

        fee_structures = FeeStructure.objects.all()

        # Student can see only his/her class fee structure.
        if request.user.role == User.STUDENT:

            fee_structures = fee_structures.filter(school_class=request.user.student.school_class)

        serializer = FeeStructureSerializer(fee_structures, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):

        serializer = FeeStructureSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        fee_structure = create_fee_structure(serializer.validated_data)

        return Response(FeeStructureSerializer(fee_structure).data, status=status.HTTP_201_CREATED)


class FeeStructureDetailAPIView(APIView):

    def get_permissions(self):

        if self.request.method == "GET":
            permission_classes = [IsAdminTeacherOrStudent]
        else:
            permission_classes = [IsAdminOrTeacher]

        return [permission() for permission in permission_classes]

    def get(self, request, pk):

        fee_structure = get_object_or_404(FeeStructure, pk=pk)

        # Student can see only his/her class fee structure.
        if request.user.role == User.STUDENT:

            if (fee_structure.school_class != request.user.student.school_class):
                raise PermissionDenied("You cannot view this fee structure.")

        serializer = FeeStructureSerializer(fee_structure)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):

        fee_structure = get_object_or_404(FeeStructure, pk=pk)
        serializer = FeeStructureSerializer(fee_structure, data=request.data)
        serializer.is_valid(raise_exception=True)
        
        fee_structure = update_fee_structure(fee_structure, serializer.validated_data)

        return Response(FeeStructureSerializer(fee_structure).data, status=status.HTTP_200_OK)

    def patch(self, request, pk):

        fee_structure = get_object_or_404(FeeStructure, pk=pk)
        serializer = FeeStructureSerializer(fee_structure, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        fee_structure = update_fee_structure(fee_structure, serializer.validated_data)

        return Response(FeeStructureSerializer(fee_structure).data, status=status.HTTP_200_OK,)


class StudentFeeListCreateAPIView(APIView):

    def get_permissions(self):

        if self.request.method == "GET":
            permission_classes = [IsAdminTeacherOrStudent]
        else:
            permission_classes = [IsAdminOrTeacher]

        return [permission() for permission in permission_classes]

    def get(self, request):

        student_fees = StudentFee.objects.all()

        # Student can see only his/her own fee records.
        if request.user.role == User.STUDENT:

            student_fees = student_fees.filter(student=request.user.student)

        serializer = StudentFeeSerializer(student_fees, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):

        serializer = StudentFeeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        student_fee = create_student_fee(serializer.validated_data)

        return Response(StudentFeeSerializer(student_fee).data, status=status.HTTP_201_CREATED)


class StudentFeeDetailAPIView(APIView):

    def get_permissions(self):

        if self.request.method == "GET":
            permission_classes = [IsAdminTeacherOrStudent]
        else:
            permission_classes = [IsAdminOrTeacher]

        return [permission() for permission in permission_classes]

    def get(self, request, pk):

        student_fee = get_object_or_404(StudentFee, pk=pk)

        # Student can see only his/her own fee.
        if request.user.role == User.STUDENT:

            if student_fee.student != request.user.student:
                raise PermissionDenied("You cannot view this student fee.")

        serializer = StudentFeeSerializer(student_fee)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):

        student_fee = get_object_or_404(StudentFee, pk=pk)
        serializer = StudentFeeSerializer(student_fee, data=request.data)
        serializer.is_valid(raise_exception=True)
        student_fee = update_student_fee(student_fee, serializer.validated_data,)

        return Response(StudentFeeSerializer(student_fee).data, status=status.HTTP_200_OK)

    def patch(self, request, pk):

        student_fee = get_object_or_404(StudentFee, pk=pk)
        serializer = StudentFeeSerializer(student_fee, data=request.data,partial=True)
        serializer.is_valid(raise_exception=True)
        student_fee = update_student_fee(student_fee, serializer.validated_data)

        return Response(StudentFeeSerializer(student_fee).data, status=status.HTTP_200_OK)



class FeePaymentListCreateAPIView(APIView):

    def get_permissions(self):

        if self.request.method == "GET":
            permission_classes = [IsAdminTeacherOrStudent]
        else:
            permission_classes = [IsAdminOrTeacher]

        return [permission() for permission in permission_classes]

    def get(self, request):

        fee_payments = FeePayment.objects.all()

        # Student can see only his/her own payments.
        if request.user.role == User.STUDENT:

            fee_payments = fee_payments.filter(student_fee__student=request.user.student)

        serializer = FeePaymentSerializer(fee_payments, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK,)

    def post(self, request):

        serializer = FeePaymentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        fee_payment = create_fee_payment(serializer.validated_data)

        return Response(FeePaymentSerializer(fee_payment).data, status=status.HTTP_201_CREATED)


class FeePaymentDetailAPIView(APIView):

    def get_permissions(self):

        if self.request.method == "GET":
            permission_classes = [IsAdminTeacherOrStudent]
        else:
            permission_classes = [IsAdminOrTeacher]

        return [permission() for permission in permission_classes]

    def get(self, request, pk):

        fee_payment = get_object_or_404(FeePayment, pk=pk)

        # Student can see only his/her own payment.
        if request.user.role == User.STUDENT:

            if (fee_payment.student_fee.student != request.user.student):
                raise PermissionDenied("You cannot view this payment.")

        serializer = FeePaymentSerializer(fee_payment)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):

        fee_payment = get_object_or_404(FeePayment, pk=pk)
        serializer = FeePaymentSerializer(fee_payment, data=request.data)
        serializer.is_valid(raise_exception=True)
        fee_payment = update_fee_payment(fee_payment, serializer.validated_data)

        return Response(FeePaymentSerializer(fee_payment).data, status=status.HTTP_200_OK)

    def patch(self, request, pk):

        fee_payment = get_object_or_404(FeePayment, pk=pk)
        serializer = FeePaymentSerializer(fee_payment, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        fee_payment = update_fee_payment(fee_payment, serializer.validated_data)

        return Response(FeePaymentSerializer(fee_payment).data, status=status.HTTP_200_OK)