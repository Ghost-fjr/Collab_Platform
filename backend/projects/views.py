# backend/projects/views.py
#
# ViewSets define the API endpoints for the Project model.
# We allow everyone to READ projects (list/retrieve)
# but require authentication for CREATE / UPDATE / DELETE.
# This improves usability (public can browse) while keeping
# data integrity and write operations secure.

from rest_framework import viewsets, permissions
from .models import Project
from .serializers import ProjectSerializer


class ProjectViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows projects to be viewed or edited.

    - GET  /api/projects/           -> List all projects (public)
    - GET  /api/projects/<id>/      -> Retrieve single project (public)
    - POST /api/projects/           -> Create a new project (auth required)
    - PUT/PATCH /api/projects/<id>/ -> Update project (auth required)
    - DELETE /api/projects/<id>/    -> Delete project (auth required)
    """
    queryset = (
        Project.objects
        .all()
        .select_related('owner')      # Optimise queries: fetch related owner in one SQL
        .prefetch_related('members')  # Prefetch many-to-many members to avoid N+1 queries
    )
    serializer_class = ProjectSerializer

    # ✅ Allow public read (GET/HEAD/OPTIONS) but restrict write actions
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        """
        When a logged-in user creates a project, automatically:
        1. Set them as the project owner
        2. Create a chat room for the project
        3. Add owner and members to the chat room
        4. Notify members that they have been added
        """
        from chat.models import ChatRoom
        from notifications.models import Notification
        
        # Save the project with the owner
        project = serializer.save(owner=self.request.user)
        
        # Create a chat room for this project
        chat_room = ChatRoom.objects.create(
            name=f"{project.name} - Discussion",
            room_type='project',
            project=project
        )
        
        # Add the owner to the chat room
        chat_room.members.add(self.request.user)
        
        # Add all project members to the chat room and notify them
        if project.members.exists():
            chat_room.members.add(*project.members.all())
            
            # Notify members
            for member in project.members.all():
                if member != self.request.user:
                    Notification.objects.create(
                        recipient=member,
                        actor=self.request.user,
                        type='project_joined',
                        message=f"You have been added to project '{project.name}'"
                    )

    def perform_update(self, serializer):
        """
        Notify members when project is updated.
        """
        from notifications.models import Notification
        
        project = serializer.save()
        
        # Notify all members about the update
        recipients = set(project.members.all())
        if project.owner != self.request.user:
            recipients.add(project.owner)
            
        for member in recipients:
            if member != self.request.user:
                Notification.objects.create(
                    recipient=member,
                    actor=self.request.user,
                    type='general',
                    message=f"Project '{project.name}' has been updated"
                )
