# backend/notifications/serializers.py
from rest_framework import serializers
from .models import Notification
from users.models import User


class UserSimpleSerializer(serializers.ModelSerializer):
    """Lightweight user serializer for embedding in notifications."""
    class Meta:
        model = User
        fields = ("id", "username")


class NotificationSerializer(serializers.ModelSerializer):
    """Serializer for notifications with embedded actor/recipient info."""
    recipient = UserSimpleSerializer(read_only=True)
    actor = UserSimpleSerializer(read_only=True)

    class Meta:
        model = Notification
        fields = (
            "id",
            "recipient",
            "actor",
            "type",
            "message",
            "is_read",
            "created_at",
        )
        read_only_fields = ("id", "recipient", "actor", "created_at")
