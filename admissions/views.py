from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.viewsets import ModelViewSet
from admissions.models import Admission
from .serializers import ApproveAdmissionSerializer
from .services import approve_admission



class AdmissionsViewSet(ModelViewSet):
    queryset = Admission.objects.all()
    serializer_class = ApproveAdmissionSerializer


class ApproveAdmissionAPIView(APIView):

    def patch(self, request, pk):

        serializer = ApproveAdmissionSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        data = approve_admission(
            admission_id=pk,
            section=serializer.validated_data["section"]
        )

        return Response(
            data,
            status=status.HTTP_200_OK
        )