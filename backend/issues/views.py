# Create your views here.
# backend/issues/views.py
from django.shortcuts import render
from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from .models import Issue, Comment
from .serializers import IssueSerializer, CommentSerializer
from django_filters.rest_framework import DjangoFilterBackend

class IssueViewSet(viewsets.ModelViewSet):
    """
    CRUD for issues. Reporter is set automatically on create.
    """
    queryset = Issue.objects.all().select_related('project','reporter').prefetch_related('assignees')
    serializer_class = IssueSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status','priority','project']
    search_fields = ['title','description']
    ordering_fields = ['created_at','priority']

    def perform_create(self, serializer):
        from notifications.models import Notification
        
        issue = serializer.save(reporter=self.request.user)
        
        # Notify all project members about the new issue
        project = issue.project
        recipients = set(project.members.all())
        recipients.add(project.owner)
        
        for member in recipients:
            if member != self.request.user:
                Notification.objects.create(
                    recipient=member,
                    actor=self.request.user,
                    type='issue_assigned', # Using existing type, could add 'issue_created'
                    message=f"New issue '{issue.title}' in project '{project.name}'"
                )

    def perform_update(self, serializer):
        from notifications.models import Notification
        
        # Get old status to check for changes
        old_instance = self.get_object()
        old_status = old_instance.status
        
        issue = serializer.save()
        
        # If status changed, notify reporter and assignees
        if issue.status != old_status:
            recipients = set(issue.assignees.all())
            recipients.add(issue.reporter)
            
            for member in recipients:
                if member != self.request.user:
                    Notification.objects.create(
                        recipient=member,
                        actor=self.request.user,
                        type='issue_status_changed',
                        message=f"Issue '{issue.title}' status changed to {issue.status}"
                    )


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all().select_related('author','issue')
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        from notifications.models import Notification
        
        comment = serializer.save(author=self.request.user)
        issue = comment.issue
        
        # Notify reporter and assignees
        recipients = set(issue.assignees.all())
        recipients.add(issue.reporter)
        
        for member in recipients:
            if member != self.request.user:
                Notification.objects.create(
                    recipient=member,
                    actor=self.request.user,
                    type='issue_commented',
                    message=f"New comment on issue '{issue.title}'"
                )
