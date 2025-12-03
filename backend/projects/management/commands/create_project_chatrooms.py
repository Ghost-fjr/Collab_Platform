# backend/projects/management/commands/create_project_chatrooms.py
"""
Management command to create chat rooms for existing projects that don't have one.
Usage: python manage.py create_project_chatrooms
"""

from django.core.management.base import BaseCommand
from projects.models import Project
from chat.models import ChatRoom


class Command(BaseCommand):
    help = 'Create chat rooms for existing projects that don\'t have one'

    def handle(self, *args, **options):
        self.stdout.write('Creating chat rooms for existing projects...')
        
        # Get all projects
        projects = Project.objects.all()
        created_count = 0
        skipped_count = 0
        
        for project in projects:
            # Check if project already has a chat room
            existing_room = ChatRoom.objects.filter(project=project).first()
            
            if existing_room:
                self.stdout.write(
                    self.style.WARNING(
                        f'  Skipped: "{project.name}" (already has chat room: {existing_room.name})'
                    )
                )
                skipped_count += 1
                continue
            
            # Create chat room for this project
            chat_room = ChatRoom.objects.create(
                name=f"{project.name} - Discussion",
                room_type='project',
                project=project
            )
            
            # Add project owner to the chat room
            chat_room.members.add(project.owner)
            
            # Add all project members to the chat room
            if project.members.exists():
                chat_room.members.add(*project.members.all())
            
            self.stdout.write(
                self.style.SUCCESS(
                    f'  ✓ Created chat room for "{project.name}" with {chat_room.members.count()} members'
                )
            )
            created_count += 1
        
        # Summary
        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS(f'Summary:'))
        self.stdout.write(self.style.SUCCESS(f'  Created: {created_count} chat rooms'))
        self.stdout.write(self.style.WARNING(f'  Skipped: {skipped_count} projects'))
        self.stdout.write(self.style.SUCCESS(f'  Total projects: {projects.count()}'))
