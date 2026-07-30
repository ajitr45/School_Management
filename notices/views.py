from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Notice
from .serializers import NoticeSerializer
from .services import create_notice, update_notice


class NoticeListCreateAPIView(APIView):
    
    def get(self, request):
        
        notices = Notice.objects.all()
        serializer = NoticeSerializer(notices, many=True,)
        
        return Response(serializer.data)
    
    
    def post(self, request):
        
        serializer = NoticeSerializer(data= request.data)
        serializer.is_valid(raise_exception=True)
        notice = create_notice(serializer.validated_data)
        serializer = NoticeSerializer(notice)
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    
class NoticeDetailAPIView(APIView):
    
    def get(self,request, pk):
        
        notice = get_object_or_404(Notice, pk=pk)
        serializer = NoticeSerializer(notice)
        
        return Response(serializer.data)
    
    
    def put(self,request, pk):
        
        notice = get_object_or_404(Notice, pk=pk)
        serializer = NoticeSerializer(Notice, data = request.data)
        serializer.is_valid(raise_exception=True,)
        notice = update_notice(notice, serializer.validated_data)
        serializer = NoticeSerializer(notice)
        
        return Response(serializer.data)
    
    
    def patch(self, request, pk):
        
        notice = get_object_or_404(Notice, pk=pk)
        serailizer = NoticeSerializer(notice, data= request.data, partial = True)
        serailizer.is_valid(raise_exception=True)
        notice = update_notice(notice, serailizer.validated_data)
        serailizer = NoticeSerializer(notice)
        
        return Response(serailizer.validated_data)
    
    
    def delete(self, request, pk):
        
        notice = get_object_or_404(Notice, pk=pk)
        notice.delete()
        
        return Response(
            {
                "Message": "Notice deleted successfully."
            },
            status=status.HTTP_204_NO_CONTENT
        )