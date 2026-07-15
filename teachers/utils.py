from .models import Teacher


def generate_teacher_id():

    last_teacher = Teacher.objects.order_by("-id").first()

    if last_teacher:

        last_number = int(
            last_teacher.teacher_id.replace("TCH", "")
        )

        return f"TCH{last_number + 1}"

    return "TCH1001"