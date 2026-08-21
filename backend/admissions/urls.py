from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdmissionViewSet, ApproveAdmissionAPIView

router = DefaultRouter()
router.register(r'', AdmissionViewSet, basename='admission')

urlpatterns = [
    path('', include(router.urls)),
    path('admissions/<int:pk>/approve/', ApproveAdmissionAPIView.as_view(), name='approve-admission'),
]