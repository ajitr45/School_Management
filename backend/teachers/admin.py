from django.contrib import admin
from .models import Teacher, TeacherAssignment

# Register your models here.
admin.site.register(Teacher)
admin.site.register(TeacherAssignment)
