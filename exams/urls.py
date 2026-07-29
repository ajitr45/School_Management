from django.urls import path 
from .views import ExamListCreateApiView, ExamDetailApiView, ExamSubjectListCreateAPIView, ExamSubjectDetailAPIView, StudentResultListCreateApiView, StudentResultDetailAPIView, ReportCardAPIView


urlpatterns = [
    
    path("exams/", ExamListCreateApiView.as_view(), name="exam-list-create"),
    path("exams/<int:pk>/", ExamDetailApiView.as_view(), name="exam-detail"),
    
    path("exam-subjects/", ExamSubjectListCreateAPIView.as_view(), name="exam-subject-list-create"),
    path("exam-subjects/<int:pk>/", ExamSubjectDetailAPIView.as_view(), name="exam-subject-detail"),
    
    path("student-results/", StudentResultListCreateApiView.as_view(), name="student-result-list-create"),
    path("student-results/<int:pk>/", StudentResultDetailAPIView.as_view(), name="student-result-detail"),
    
    path("report-card/<int:student_id>/<int:exam_id>/", ReportCardAPIView.as_view(), name="report-card"),
]
