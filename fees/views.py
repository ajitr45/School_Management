from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import ( FeeStructure, StudentFee, FeePayment,)
from .serializers import (FeeStructureSerializer, StudentFeeSerializer, FeePaymentSerializer,)
from .services import (create_student_fee,update_student_fee,create_fee_payment,update_fee_payment,)


class FeeStructureListCreateAPIView(APIView):

    def get(self, request):

        fee_structures = FeeStructure.objects.all()

        serializer = FeeStructureSerializer(
            fee_structures,
            many=True,
        )

        return Response(serializer.data)

    def post(self, request):

        serializer = FeeStructureSerializer(data=request.data, )

        if serializer.is_valid():

            serializer.save()

            return Response( serializer.data, status=status.HTTP_201_CREATED,)

        return Response( serializer.errors, status=status.HTTP_400_BAD_REQUEST,)


class FeeStructureDetailAPIView(APIView):

    def get(self, request, pk):

        fee_structure = get_object_or_404( FeeStructure, pk=pk,)
        serializer = FeeStructureSerializer(fee_structure,)
        return Response(serializer.data)

    def put(self, request, pk):

        fee_structure = get_object_or_404( FeeStructure, pk=pk,)

        serializer = FeeStructureSerializer( fee_structure, data=request.data,)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response( serializer.errors, status=status.HTTP_400_BAD_REQUEST,)

    def patch(self, request, pk):

        fee_structure = get_object_or_404( FeeStructure, pk=pk,)
        serializer = FeeStructureSerializer( fee_structure, data=request.data, partial=True,)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response( serializer.errors, status=status.HTTP_400_BAD_REQUEST,)


class StudentFeeListCreateAPIView(APIView):

    def get(self, request):

        student_fees = StudentFee.objects.all()
        serializer = StudentFeeSerializer( student_fees, many=True,)
        return Response(serializer.data)

    def post(self, request):

        serializer = StudentFeeSerializer( data=request.data,)
        if serializer.is_valid():

            # Create student fee using service layer
            student_fee = create_student_fee(serializer.validated_data,)

            serializer = StudentFeeSerializer(student_fee,)

            return Response( serializer.data, status=status.HTTP_201_CREATED,)

        return Response( serializer.errors, status=status.HTTP_400_BAD_REQUEST,)


class StudentFeeDetailAPIView(APIView):

    def get(self, request, pk):

        # Fetch student fee by primary key
        student_fee = get_object_or_404( StudentFee, pk=pk )
        serializer = StudentFeeSerializer(student_fee,)
        return Response(serializer.data)

    def put(self, request, pk):

        # Fetch existing student fee
        student_fee = get_object_or_404( StudentFee, pk=pk )

        serializer = StudentFeeSerializer( student_fee, data=request.data,)
        if serializer.is_valid():

            # Update student fee using service layer
            student_fee = update_student_fee( student_fee, serializer.validated_data,)
            serializer = StudentFeeSerializer(student_fee)
            return Response(serializer.data)

        return Response( serializer.errors, status=status.HTTP_400_BAD_REQUEST,)

    def patch(self, request, pk):

        # Fetch existing student fee
        student_fee = get_object_or_404( StudentFee, pk=pk )

        serializer = StudentFeeSerializer(student_fee,
            data=request.data,
            partial=True,
        )
        if serializer.is_valid():

            # Update only provided fields
            student_fee = update_student_fee(student_fee, serializer.validated_data,)

            serializer = StudentFeeSerializer(student_fee,)
            return Response(serializer.data)

        return Response( serializer.errors, status=status.HTTP_400_BAD_REQUEST,)


class FeePaymentListCreateAPIView(APIView):

    def get(self, request):

        # Retrieve all fee payment records
        fee_payments = FeePayment.objects.all()
        serializer = FeePaymentSerializer( fee_payments, many=True,)
        return Response(serializer.data)

    def post(self, request):

        serializer = FeePaymentSerializer(data=request.data,)
        if serializer.is_valid():

            # Create fee payment using service layer
            fee_payment = create_fee_payment( serializer.validated_data,)

            serializer = FeePaymentSerializer(fee_payment,)

            return Response( serializer.data, status=status.HTTP_201_CREATED,)

        return Response( serializer.errors, status=status.HTTP_400_BAD_REQUEST,)


class FeePaymentDetailAPIView(APIView):

    def get(self, request, pk):

        # Fetch fee payment by primary key
        fee_payment = get_object_or_404( FeePayment, pk=pk,)
        serializer = FeePaymentSerializer( fee_payment,)
        return Response(serializer.data)

    def put(self, request, pk):

        # Fetch existing fee payment
        fee_payment = get_object_or_404( FeePayment, pk=pk,)

        serializer = FeePaymentSerializer(
            fee_payment,
            data=request.data,
        )

        if serializer.is_valid():

            # Update fee payment using service layer
            fee_payment = update_fee_payment(fee_payment, serializer.validated_data,)

            serializer = FeePaymentSerializer(fee_payment,)
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST,)

    def patch(self, request, pk):

        # Fetch existing fee payment
        fee_payment = get_object_or_404( FeePayment, pk=pk,)

        serializer = FeePaymentSerializer( fee_payment, data=request.data, partial=True,)
        if serializer.is_valid():

            # Update only provided fields
            fee_payment = update_fee_payment( fee_payment, serializer.validated_data )

            serializer = FeePaymentSerializer(fee_payment)
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST,)