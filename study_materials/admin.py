from django.contrib import admin
from .models import Chapter, StudyMaterial


@admin.register(Chapter)
class ChapterAdmin(admin.ModelAdmin):
    
    list_display = [
        
        "id",
        "chapter_number",
        "name",
        "school_class",
        "subject",
        "created_at",
    ]
    
    search_fields = ["name"]
    

@admin.register(StudyMaterial)
class StudyMaterialAdmin(admin.ModelAdmin):
    
    list_display = [
        "id",
        "chapter",
        "description",
        'created_at',
    ]

    search_fields = ["chapter__name"]