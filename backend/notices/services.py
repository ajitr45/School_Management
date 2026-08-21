from rest_framework.exceptions import ValidationError
from .models import Notice


def validate_notice(audience, school_class):

    if audience == "CLASS" and school_class is None:
        raise ValidationError(
            {
                "school_class": "School class is required when audience is CLASS."
            }
        )

    if audience != "CLASS" and school_class is not None:
        raise ValidationError(
            {
                "school_class": "School class should only be selected when audience is CLASS."
            }
        )


def create_notice(validated_data):

    validate_notice(
        validated_data.get("audience"),
        validated_data.get("school_class"),
    )
    return Notice.objects.create(**validated_data)


def update_notice(notice, validated_data):

    audience = validated_data.get( "audience", notice.audience )
    school_class = validated_data.get( "school_class", notice.school_class,)
    validate_notice(audience, school_class )

    for field, value in validated_data.items():
        setattr(notice, field, value)

    notice.save()
    return notice