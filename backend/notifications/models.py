# Create your models here.
# backend/notifications/models.py
from django.db import models
from django.conf import settings

class Notification(models.Model):
    TYPE_CHOICES = [
        ('issue_assigned', 'Issue Assigned'),
        ('issue_commented', 'Issue Commented'),
        ('issue_status_changed', 'Issue Status Changed'),
        ('project_joined', 'Project Joined'),
        ('general', 'General'),
    ]

    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='notifications',
        on_delete=models.CASCADE
    )
    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='notifications_sent',
        on_delete=models.SET_NULL,
        null=True, blank=True
    )
    type = models.CharField(max_length=50, choices=TYPE_CHOICES, default='general')
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"To {self.recipient.username}: {self.message[:30]}"
