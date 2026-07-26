from django.shortcuts import render
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Timetable
from .serializers import TimetableSerializer
from .services import create_timetable, update_timetable



class TimetableListCreateAPIView(APIView):

    def get(self, request):

        timetables = Timetable.objects.all()
        serializer = TimetableSerializer( timetables, many=True,)
        return Response(serializer.data)

    def post(self, request):

        serializer = TimetableSerializer( data=request.data,)
        serializer.is_valid(raise_exception=True)
        timetable = create_timetable(serializer.validated_data,)

        return Response( TimetableSerializer(timetable).data, status=status.HTTP_201_CREATED,)


class TimetableDetailAPIView(APIView):

    def get(self, request, pk):

        timetable = get_object_or_404( Timetable, pk=pk,)
        serializer = TimetableSerializer(timetable,)
        return Response(serializer.data)

    def put(self, request, pk):

        timetable = get_object_or_404( Timetable, pk=pk,)
        serializer = TimetableSerializer( timetable, data=request.data,)
        serializer.is_valid(raise_exception=True)
        timetable = update_timetable( timetable, serializer.validated_data,)

        return Response( TimetableSerializer(timetable).data, status=status.HTTP_200_OK,)

    def patch(self, request, pk):

        timetable = get_object_or_404( Timetable, pk=pk,)
        serializer = TimetableSerializer( timetable, data=request.data, partial=True,)
        serializer.is_valid(raise_exception=True)
        timetable = update_timetable(timetable, serializer.validated_d )

        return Response( TimetableSerializer(timetable).data, status=status.HTTP_200_OK,)

