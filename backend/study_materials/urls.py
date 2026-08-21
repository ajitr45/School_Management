from django.urls import path 
from .views import ChapterListCreateAPIView, ChapterDetailAPIView, StudyMaterialListCreateAPIView, StudyMaterialDetailAPIView


urlpatterns = [
    
    path("chapters/", ChapterListCreateAPIView.as_view(), name="chapter-list-create"),
    path("chapters/<int:pk>/", ChapterDetailAPIView.as_view(), name="chapter-detail"),
    
    path("", StudyMaterialListCreateAPIView.as_view(), name="study-material-list-create"),
    path("<int:pk>/", StudyMaterialDetailAPIView.as_view(), name="study-material-detail"),
]
