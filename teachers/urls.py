from django.urls import path
from teachers.views import TeacherCreateAPIView, TeacherAssignmentAPIView

urlpatterns = [
    path("", TeacherCreateAPIView.as_view(), name="teacher-create"),
    path("assign/", TeacherAssignmentAPIView.as_view(), name="teacher-assignment")
]