from django.conf import settings
from django.core.mail import send_mail


def send_student_credentials(email, student_id, password, student_name):

    send_mail(
        subject="School Management - Admission Approved",

        message=f"""
            Dear Student,{student_name},

            Congratulations!

            Your admission has been approved successfully.

            Student ID: {student_id}
            Username: {student_id}
            Password: {password}

            Please keep your login credentials safe.

            Regards,
            School Management
            """,

        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[email],
        fail_silently=False,
    )           