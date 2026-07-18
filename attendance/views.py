from django.shortcuts import render
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Attendance
from .serializers import (AttendanceCreateSerializer,AttendanceUpdateSerializer,AttendanceDetailSerializer,)
from .services import ( create_attendance, update_attendance,)


class AttendanceListCreateAPIView(APIView):

    def get(self, request):

        attendances = Attendance.objects.all()

        serializer = AttendanceDetailSerializer( attendances, many=True)

        return Response( serializer.data, status=status.HTTP_200_OK)

    def post(self, request):

        serializer = AttendanceCreateSerializer( data=request.data)

        serializer.is_valid(raise_exception=True)

        attendance = create_attendance(request,serializer.validated_data,)

        serializer = AttendanceDetailSerializer(attendance)

        return Response( serializer.data, status=status.HTTP_201_CREATED)


class AttendanceDetailAPIView(APIView):

    def get(self, request, pk):

        attendance = get_object_or_404( Attendance, pk=pk)

        serializer = AttendanceDetailSerializer( attendance)

        return Response( serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, pk):

        attendance = get_object_or_404( Attendance, pk=pk)

        serializer = AttendanceUpdateSerializer( attendance, data=request.data, partial=True)

        serializer.is_valid(raise_exception=True)

        attendance = update_attendance( attendance, serializer.validated_data)

        serializer = AttendanceDetailSerializer( attendance)

        return Response( serializer.data, status=status.HTTP_200_OK)


