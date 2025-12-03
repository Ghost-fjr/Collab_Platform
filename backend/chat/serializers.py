# backend/chat/serializers.py
from rest_framework import serializers
from .models import ChatRoom, Message
from users.models import User

class UserSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name')


class MessageSerializer(serializers.ModelSerializer):
    sender = UserSimpleSerializer(read_only=True)
    
    class Meta:
        model = Message
        fields = ('id', 'room', 'sender', 'content', 'created_at', 'is_read')
        read_only_fields = ('sender', 'created_at')


class ChatRoomSerializer(serializers.ModelSerializer):
    members = UserSimpleSerializer(many=True, read_only=True)
    messages = MessageSerializer(many=True, read_only=True)
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()
    
    class Meta:
        model = ChatRoom
        fields = (
            'id', 'name', 'room_type', 'project', 'members', 
            'messages', 'last_message', 'unread_count', 
            'created_at', 'updated_at'
        )
        read_only_fields = ('created_at', 'updated_at')
    
    def get_last_message(self, obj):
        last_msg = obj.messages.last()
        if last_msg:
            return MessageSerializer(last_msg).data
        return None
    
    def get_unread_count(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.messages.filter(is_read=False).exclude(sender=request.user).count()
        return 0


class ChatRoomListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing chat rooms"""
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()
    
    class Meta:
        model = ChatRoom
        fields = ('id', 'name', 'room_type', 'last_message', 'unread_count', 'updated_at')
    
    def get_last_message(self, obj):
        last_msg = obj.messages.last()
        if last_msg:
            return {
                'content': last_msg.content[:50],
                'sender': last_msg.sender.username if last_msg.sender else 'Unknown',
                'created_at': last_msg.created_at
            }
        return None
    
    def get_unread_count(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.messages.filter(is_read=False).exclude(sender=request.user).count()
        return 0
