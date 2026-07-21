from django.urls import path
from .views import (FeeStructureListCreateAPIView,FeeStructureDetailAPIView,StudentFeeListCreateAPIView,StudentFeeDetailAPIView,)

urlpatterns = [
    path( "fee-structures/", FeeStructureListCreateAPIView.as_view(), name="fee-structure-list-create",),
    path( "fee-structures/<int:pk>/", FeeStructureDetailAPIView.as_view(), name="fee-structure-detail",),
    path( "student-fees/", StudentFeeListCreateAPIView.as_view(), name="student-fee-list-create",),
    path( "student-fees/<int:pk>/", StudentFeeDetailAPIView.as_view(), name="student-fee-detail",),
]