from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdmissionsViewSet

router = DefaultRouter()
router.register(r'admissions', AdmissionsViewSet, basename='admission')

urlpatterns = [
    path('', include(router.urls)),
]