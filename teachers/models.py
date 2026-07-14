from django.db import models
from accounts.models import User
from academics.models import SchoolClass, Section, Subject

# Create your models here.

class Teacher(models.Model):

    user = models.OneToOneField( User,on_delete=models.CASCADE)

    teacher_id = models.CharField(max_length=20,unique=True)

    joining_date = models.DateField( auto_now_add=True )

    def __str__(self):
        return self.teacher_id
    
    
class TeacherAssignment(models.Model):

    teacher = models.ForeignKey( Teacher,on_delete=models.CASCADE)

    school_class = models.ForeignKey( SchoolClass,on_delete=models.CASCADE)

    section = models.ForeignKey( Section,on_delete=models.CASCADE)

    subject = models.ForeignKey( Subject,on_delete=models.CASCADE)
    
    
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['teacher', 'school_class', 'section', 'subject'],
                name='unique_teacher_assignment'
            )
        ]

    def __str__(self):
        return f"{self.teacher} - {self.school_class} - {self.section} - {self.subject}"