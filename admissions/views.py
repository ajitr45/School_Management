from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework.viewsets import ModelViewSet
from .models import Admission
from .serializers import AdmissionSerializer
from rest_framework import status
from rest_framework.views import APIView
from .serializers import ApproveAdmissionSerializer
from rest_framework.response import Response
from accounts.models import User
from students.models import Student
from students.utils import generate_student_id, generate_roll_number, generate_password 

# Create your views here.

class AdmissionViewSet(ModelViewSet):
    queryset = Admission.objects.all()
    serializer_class = AdmissionSerializer
    
    
    
class ApproveAdmissionAPIView(APIView):
    
    @transaction.atomic
    def patch(self, request, pk):
        admission = get_object_or_404(Admission, pk=pk)
        if admission.status == "APPROVED":
            return Response({'message': 'Admission is already approved.'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = ApproveAdmissionSerializer(data=request.data)
        if serializer.is_valid( raise_exception=True):
            section = serializer.validated_data['section']
            student_id = generate_student_id()
            password = generate_password()
            roll_number = generate_roll_number(section,admission.applying_class)
            
            
            # Create a new User instance for the student
            user = User.objects.create_user(
                username = student_id,
                email= admission.student_email,
                password = password,
                role = "STUDENT",
            )
            
            # Create a new Student instance
            student = Student.objects.create(
                user=user,
                admission=admission,
                student_id=student_id,
                roll_number=roll_number,
                school_class = admission.applying_class,
                section=section
            )
            
            # Update the admission status to "Apporve"
            admission.status = "APPROVED"
            admission.save()
            
            return Response(
                {
                    'message': 'Admission approved and student created successfully.',
                     "student_id": student_id,
                     "roll_number": roll_number,
                     "password": password
                             
                }, 
                
                status=status.HTTP_200_OK)
      