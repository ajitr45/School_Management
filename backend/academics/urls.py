from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SchoolClassViewSet, SectionViewSet, SubjectViewSet

router = DefaultRouter()
router.register(r'classes', SchoolClassViewSet, basename='class')
router.register(r'sections', SectionViewSet, basename='section')
router.register(r'subjects', SubjectViewSet, basename='subject')

urlpatterns = [
    path('', include(router.urls)),
]