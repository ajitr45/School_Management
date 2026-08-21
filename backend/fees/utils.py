from .models import StudentFee


def generate_receipt_number():

    last_fee = StudentFee.objects.order_by("-id").first()

    if last_fee:
        last_number = int(last_fee.receipt_number.replace("RCPT", ""))
        return f"RCPT{last_number + 1}"

    return "RCPT1001"