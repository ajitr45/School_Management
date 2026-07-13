import random
import string

from .models import Student


def generate_student_id():

    last_student = Student.objects.order_by("-id").first()

    if last_student:

        last_number = int(last_student.student_id.replace("STU", ""))
        return f"STU{last_number + 1}"

    return "STU1001"


def generate_roll_number(school_class,section):

    last_roll = Student.objects.filter(school_class=school_class,section=section).count()

    return last_roll + 1


def generate_password(length=8):

    characters = (string.ascii_letters + string.digits + "!@#$%&*")

    return "".join(random.choice(characters)for _ in range(length))