# Create your models here.
# backend/issues/models.py
from django.db import models
from django.conf import settings
from projects.models import Project

class Issue(models.Model):
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('closed', 'Closed'),
    ]
    PRIORITY_CHOICES = [
        ('low','Low'),
        ('medium','Medium'),
        ('high','High'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    project = models.ForeignKey(Project, related_name='issues', on_delete=models.CASCADE)
    reporter = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='reported_issues', on_delete=models.SET_NULL, null=True)
    assignees = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='assigned_issues', blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} ({self.project.name})"


class Comment(models.Model):
    issue = models.ForeignKey(Issue, related_name='comments', on_delete=models.CASCADE)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='comments', on_delete=models.SET_NULL, null=True)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
