from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.viewsets import ModelViewSet
from admissions.models import Admission
from .serializers import AdmissionSerializer, ApproveAdmissionSerializer
from .services import approve_admission
from accounts.permissions import IsAdmin



class AdmissionViewSet(ModelViewSet):
    queryset = Admission.objects.all()
    serializer_class = AdmissionSerializer

class ApproveAdmissionAPIView(APIView):
    
    permission_classes = [IsAdmin]

    def patch(self, request, pk):

        serializer = ApproveAdmissionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = approve_admission(admission_id=pk,section=serializer.validated_data["section"])
        return Response(data,status=status.HTTP_200_OK)