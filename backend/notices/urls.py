from django.urls import path
from .views import NoticeListCreateAPIView, NoticeDetailAPIView


urlpatterns= [
    
    path("", NoticeListCreateAPIView.as_view(), name="notice-list-create"),
    path("<int:pk>/", NoticeDetailAPIView.as_view(), name="notice-detail"),
    
]