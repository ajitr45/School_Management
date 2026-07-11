from django.db import models

from accounts.models import User
from admissions.models import Admission
from academics.models import SchoolClass, Section


class Student(models.Model):

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    admission = models.OneToOneField( Admission, on_delete=models.CASCADE)
    student_id = models.CharField( max_length=20,unique=True)
    roll_number = models.PositiveIntegerField()
    school_class = models.ForeignKey( SchoolClass,on_delete=models.CASCADE)
    section = models.ForeignKey( Section,on_delete=models.CASCADE)
    admission_date = models.DateField( auto_now_add=True)

    def __str__(self):
        return self.student_id