# backend/projects/serializers.py
from rest_framework import serializers
from .models import Project
from users.models import User
from issues.models import Issue   # ✅ import Issue model


class UserSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username')


# ✅ Lightweight issue serializer for nesting inside projects
class IssueLiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Issue
        fields = ('id', 'title', 'status', 'priority')


class ProjectSerializer(serializers.ModelSerializer):
    owner = UserSimpleSerializer(read_only=True)
    members = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        many=True,
        required=False
    )
    members_detail = UserSimpleSerializer(source='members', many=True, read_only=True)
    member_count = serializers.SerializerMethodField()
    issues = IssueLiteSerializer(many=True, read_only=True)
    progress = serializers.SerializerMethodField()
    stats = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = (
            'id',
            'name',
            'description',
            'owner',
            'members',
            'members_detail',
            'member_count',
            'created_at',
            'start_date',
            'end_date',
            'funds_allocated',
            'issues',
            'progress',
            'stats',
        )

    def get_member_count(self, obj):
        return obj.members.count()

    def get_progress(self, obj):
        total = obj.issues.count()
        if total == 0:
            return 0
        closed = obj.issues.filter(status='closed').count()
        return int((closed / total) * 100)

    def get_stats(self, obj):
        return {
            'total': obj.issues.count(),
            'open': obj.issues.filter(status='open').count(),
            'in_progress': obj.issues.filter(status='in_progress').count(),
            'closed': obj.issues.filter(status='closed').count(),
        }
