from rest_framework import serializers
from .models import FeeStructure, StudentFee, FeePayment


class FeeStructureSerializer(serializers.ModelSerializer):

    class Meta:
        model = FeeStructure
        fields = "__all__"



class StudentFeeSerializer(serializers.ModelSerializer):

    student_name = serializers.CharField(source="student.admission.student_name", read_only=True)
    student_id = serializers.CharField(source="student.student_id", read_only=True)

    class Meta:
        model = StudentFee

        fields = [
            "id",
            "student",
            "student_id",
            "student_name",
            "fee_structure",
            "status",
            "assigned_date",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "student_id",
            "student_name",
            "status",
            "assigned_date",
            "created_at",
            "updated_at",
        ]

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
