from rest_framework import serializers
from .models import FeeStructure, StudentFee, FeePayment


class FeeStructureSerializer(serializers.ModelSerializer):

    class Meta:
        model = FeeStructure
        fields = "__all__"



class StudentFeeSerializer(serializers.ModelSerializer):

    student_name = serializers.CharField(source="student.admission.student_name", read_only=True,)

    class Meta:
        model = StudentFee
        fields = "__all__"
        
        read_only_fields = (
            "status",
            "assigned_date",
            "created_at",
            "updated_at",
        )


class FeePaymentSerializer(serializers.ModelSerializer):

    student_name = serializers.CharField(source="student_fee.student.admission.student_name", read_only=True,)

    class Meta:
        model = FeePayment
        fields = "__all__"
        read_only_fields = (
            "student_fee",
            "receipt_number",
            "payment_date",
            "created_at",
            "updated_at",
        )
