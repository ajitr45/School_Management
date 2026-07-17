from django.urls import path
from teachers.views import TeacherCreateAPIView, TeacherAssignmentAPIView, TeacherListAPIView, TeacherDetailAPIView

urlpatterns = [
    path("", TeacherCreateAPIView.as_view(), name="teacher-create"),
    path("assign/", TeacherAssignmentAPIView.as_view(), name="teacher-assignment"),
    path("list/", TeacherListAPIView.as_view(), name="teacher-list"),
    path("detail/<int:teacher_id>/", TeacherDetailAPIView.as_view(), name="teacher-detail"),
]