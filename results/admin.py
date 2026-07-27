from django.contrib import admin
from .models import Result, ResultDetail


@admin.register(Result)
class ResultAdmin(admin.ModelAdmin):

    list_display = (
        "student",
        "exam",
        "obtained_marks",
        "total_marks",
        "percentage",
        "grade",
        "status",
    )

    list_filter = (
        "exam",
        "status",
    )

    search_fields = (
        "student__student_id",
        "student__user__first_name",
        "student__user__last_name",
    )


@admin.register(ResultDetail)
class ResultDetailAdmin(admin.ModelAdmin):

    list_display = (
        "result",
        "subject",
        "obtained_marks",
        "total_marks",
    )

    list_filter = ("subject",)

    search_fields = (
        "result__student__student_id",
        "subject__name",
    )
