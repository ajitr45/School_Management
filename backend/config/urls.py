from django.contrib import admin
from django.urls import path,include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/accounts/', include('accounts.urls')),
    path('api/academics/', include('academics.urls')),
    path('api/admissions/', include('admissions.urls')),
    path("api/students/", include("students.urls")),
    path("api/teachers/", include("teachers.urls")),
    path("api/attendance/", include("attendance.urls")),
    path("api/fees/", include("fees.urls")),
    path("api/exams/", include("exams.urls")),
    path("api/timetable/", include("timetable.urls")),
    path("api/homework/", include("homework.urls")),
    path("api/notices/", include("notices.urls")),
    path("api/study-materials/", include("study_materials.urls")),

    ]
