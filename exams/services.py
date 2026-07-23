from rest_framework.exceptions import ValidationError
from .models import Exam, ExamSubject, StudentResult


def create_exam(validated_data):
    
    return Exam.objects.create(**validated_data)



def updated_exam(exam, validated_date):
    
    for attr, value in validated_date.items():
        setattr(exam, attr, value)
        exam.save()
        return exam
    
    
def create_exam_subject(validated_data):
    
    if validated_data["pass_marks"] > validated_data["maximum_marks"]:
        raise ValidationError(
            {
                "pass_marks": "pass marks cannot be greater than maximum marks."
            }
        )
        
    else:
        return ExamSubject.objects.create(**validated_data)
    
    
    
def updated_exam_subject(exam_subject, validated_data):
    
    maximum_marks = validated_data.get("maximun_marks", exam_subject.maximum_marks,)
    pass_marks = validated_data("pass_marks", exam_subject.pass_marks,)
    
    if pass_marks > maximum_marks:
        raise ValidationError(
            {
                "pass_marks" : "Pass marks cannot be greater than maximum marks."
            }
        )
        
    for attr, value in validated_data.items():
        setattr(exam_subject, attr, value)
        
    exam_subject.save()
    return exam_subject    
    
    

def create_student_result(validated_data):
    
    exam_subject = validated_data["exam_subject"]
    marks_obtained = validated_data["marks_obtained"]
    
    
    if marks_obtained > exam_subject.maximum_marks:
        raise ValidationError(
            {
                "marks_obtained" : "Marks obtained cannot exceed maximum marks."
            }
        )    
    return StudentResult.objects.create(**validated_data)



def updated_student_result(student_result, validated_data):
    
    exam_subject = validated_data.get("exam_subject", student_result.exam_subjects,)
    marks_obtained = validated_data.get("marks_obtained", student_result.marks.obtained,)
    
    
    if marks_obtained > exam_subject.maximum_marks:
        raise ValidationError(
            {
                "marks_obtained" : "Marks obtained cannnot exceed maximum marks."
            }
        )

    for attr, value in validated_data.items():
        setattr(student_result, attr, value)
        
    student_result.save()
    return student_result