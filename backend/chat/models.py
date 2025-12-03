# backend/chat/models.py
from django.db import models
from django.conf import settings
from projects.models import Project

class ChatRoom(models.Model):
    """
    Chat room for project discussions.
    Each project can have multiple chat rooms.
    """
    ROOM_TYPE_CHOICES = [
        ('project', 'Project'),
        ('direct', 'Direct Message'),
        ('group', 'Group'),
    ]
    
    name = models.CharField(max_length=200)
    room_type = models.CharField(max_length=20, choices=ROOM_TYPE_CHOICES, default='project')
    project = models.ForeignKey(
        Project, 
        related_name='chat_rooms', 
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    members = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='chat_rooms')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return f"{self.name} ({self.room_type})"


class Message(models.Model):
    """
    Individual message in a chat room.
    """
    room = models.ForeignKey(ChatRoom, related_name='messages', on_delete=models.CASCADE)
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        related_name='sent_messages', 
        on_delete=models.SET_NULL,
        null=True
    )
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"{self.sender.username if self.sender else 'Unknown'}: {self.content[:50]}"
