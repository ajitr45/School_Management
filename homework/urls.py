from django.urls import path
from .views import  HomeworkListCreateAPIView, HomeworkDetailAPIView

urlpatterns = [
    
    path( "", HomeworkListCreateAPIView.as_view(), name="homework-list-create",),
    path( "<int:pk>/", HomeworkDetailAPIView.as_view(), name="homework-detail",),
]