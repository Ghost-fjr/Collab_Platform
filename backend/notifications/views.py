# backend/notifications/views.py
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Notification
from .serializers import NotificationSerializer


class NotificationViewSet(viewsets.ModelViewSet):
    """
    API endpoint for notifications.
    - Lists only the current user's notifications
    - Allows marking as read/unread
    - Supports bulk mark-all-read
    """
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Limit queryset to logged-in user's notifications."""
        return Notification.objects.filter(recipient=self.request.user)

    def perform_create(self, serializer):
        """Ensure recipient is always the logged-in user."""
        serializer.save(recipient=self.request.user)

    # -------------------------------------------------------------------------
    # Custom Actions
    # -------------------------------------------------------------------------
    @action(detail=True, methods=["post"])
    def mark_read(self, request, pk=None):
        """Mark a single notification as read."""
        notification = self.get_object()
        notification.is_read = True
        notification.save(update_fields=["is_read"])
        return Response({"status": "marked as read"}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def mark_unread(self, request, pk=None):
        """Mark a single notification as unread."""
        notification = self.get_object()
        notification.is_read = False
        notification.save(update_fields=["is_read"])
        return Response({"status": "marked as unread"}, status=status.HTTP_200_OK)

    @action(detail=False, methods=["post"])
    def mark_all_read(self, request):
        """Mark all of the user's notifications as read."""
        updated = self.get_queryset().update(is_read=True)
        return Response(
            {"status": f"{updated} notifications marked as read"},
            status=status.HTTP_200_OK,
        )
