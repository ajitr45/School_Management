from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdmissionViewSet, ApproveAdmissionAPIView, RejectAdmissionAPIView

router = DefaultRouter()
router.register(r'', AdmissionViewSet, basename='admission')

urlpatterns = [
    path('', include(router.urls)),
    path('<int:pk>/approve/', ApproveAdmissionAPIView.as_view(), name='approve-admission'),
    path('<int:pk>/reject/', RejectAdmissionAPIView.as_view(), name='reject-admission'),
]