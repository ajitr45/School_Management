from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny

from accounts.permissions import IsAdmin

from .models import Admission
from .serializers import (
    AdmissionSerializer,
    ApproveAdmissionSerializer,
)
from .services import approve_admission


class AdmissionViewSet(ModelViewSet):

    queryset = Admission.objects.all()
    serializer_class = AdmissionSerializer

    def get_permissions(self):

        # Anyone can submit an online admission application.
        if self.action == "create":
            permission_classes = [
                AllowAny
            ]

        # Only Admin can view or update
        # existing admission records.
        elif self.action in [
            "list",
            "retrieve",
            "update",
            "partial_update",
        ]:
            permission_classes = [
                IsAdmin
            ]

        # DELETE is disabled below.
        else:
            permission_classes = [
                IsAdmin
            ]

        return [
            permission()
            for permission in permission_classes
        ]

    def destroy(
        self,
        request,
        *args,
        **kwargs
    ):

        return Response(
            {
                "detail": (
                    "Deleting an admission "
                    "is not allowed."
                )
            },
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
        )


class ApproveAdmissionAPIView(APIView):

    # Only Admin can approve an admission.
    permission_classes = [
        IsAdmin
    ]

    def patch(
        self,
        request,
        pk
    ):

        serializer = ApproveAdmissionSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        data = approve_admission(
            admission_id=pk,
            section=serializer.validated_data["section"],
        )

        return Response(
            data,
            status=status.HTTP_200_OK,
        )