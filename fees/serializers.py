from rest_framework import serializers
from .models import FeeStructure, StudentFee



class FeeStructureSerializer(serializers.ModelSerializer):

    class Meta:
        model = FeeStructure
        fields = "__all__"

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Fee amount must be greater than zero."
            )
        return value
    
    

class StudentFeeSerializer(serializers.ModelSerializer):

    class Meta:
        model = StudentFee

        fields = "__all__"

        read_only_fields = (
            "receipt_number",
            "status",
            "created_at",
            "updated_at",
        )

    def validate_amount_paid(self, value):

        if value < 0:
            raise serializers.ValidationError(
                "Amount cannot be negative."
            )

        return value    