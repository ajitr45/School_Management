from django.contrib import admin
from django.urls import path,include

urlpatterns = [
    path('admin/', admin.site.urls),
    
    
    path('api/accounts/', include('accounts.urls')),
    path('api/academics/', include('academics.urls')),
    path('api/admissions/', include('admissions.urls')),
    path("api/students/", include("students.urls")),
    path("api/teachers/", include("teachers.urls")),
    ]
