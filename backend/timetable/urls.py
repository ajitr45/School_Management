from django.urls import path
from .views import TimetableListCreateAPIView, TimetableDetailAPIView


urlpatterns = [

    path("", TimetableListCreateAPIView.as_view(), name="timetable-list-create",),
    path("<int:pk>/", TimetableDetailAPIView.as_view(), name="timetable-detail",),
]