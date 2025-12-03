# backend/chat/views.py
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import ChatRoom, Message
from .serializers import (
    ChatRoomSerializer, 
    ChatRoomListSerializer, 
    MessageSerializer
)


class ChatRoomViewSet(viewsets.ModelViewSet):
    """
    API endpoint for chat rooms.
    Users can only see rooms they are members of.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Only show rooms where user is a member
        return ChatRoom.objects.filter(members=self.request.user).prefetch_related('members', 'messages')
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ChatRoomListSerializer
        return ChatRoomSerializer
    
    def perform_create(self, serializer):
        # Create room and add creator as member
        room = serializer.save()
        room.members.add(self.request.user)
    
    @action(detail=True, methods=['post'])
    def join(self, request, pk=None):
        """Add current user to chat room"""
        room = self.get_object()
        room.members.add(request.user)
        return Response({'status': 'joined'})
    
    @action(detail=True, methods=['post'])
    def leave(self, request, pk=None):
        """Remove current user from chat room"""
        room = self.get_object()
        room.members.remove(request.user)
        return Response({'status': 'left'})


class MessageViewSet(viewsets.ModelViewSet):
    """
    API endpoint for messages.
    Users can only see messages in rooms they are members of.
    """
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Only show messages from rooms user is a member of
        user_rooms = ChatRoom.objects.filter(members=self.request.user)
        return Message.objects.filter(room__in=user_rooms).select_related('sender', 'room')
    
    def perform_create(self, serializer):
        # Set sender to current user
        serializer.save(sender=self.request.user)
    
    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """Mark message as read"""
        message = self.get_object()
        message.is_read = True
        message.save()
        return Response({'status': 'marked as read'})
