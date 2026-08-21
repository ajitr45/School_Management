from rest_framework.permissions import BasePermission
from .models import User


class IsAdmin(BasePermission):

    def has_permission(self, request, view):

        return (
            request.user.is_authenticated and
            request.user.role == User.ADMIN
        )


class IsTeacher(BasePermission):

    def has_permission(self, request, view):

        return (
            request.user.is_authenticated and
            request.user.role == User.TEACHER
        )


class IsStudent(BasePermission):

    def has_permission(self, request, view):

        return (
            request.user.is_authenticated and
            request.user.role == User.STUDENT
        )


class IsAdminOrTeacher(BasePermission):

    def has_permission(self, request, view):

        return (
            request.user.is_authenticated and
            request.user.role in [User.ADMIN, User.TEACHER]
        )


class IsAdminTeacherOrStudent(BasePermission):

    def has_permission(self, request, view):

        return (
            request.user.is_authenticated and
            request.user.role in [
                User.ADMIN,
                User.TEACHER,
                User.STUDENT,
            ]
        )