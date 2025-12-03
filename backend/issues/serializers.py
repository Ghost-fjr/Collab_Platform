from rest_framework import serializers
from .models import Issue, Comment
from users.models import User
from projects.models import Project   # ✅ import Project


class UserSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id','username','first_name','last_name','role')


class CommentSerializer(serializers.ModelSerializer):
    author = UserSimpleSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ('id','issue','author','content','created_at')
        read_only_fields = ('author','created_at')


class IssueSerializer(serializers.ModelSerializer):
    reporter = UserSimpleSerializer(read_only=True)
    assignees = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), many=True, required=False
    )
    comments = CommentSerializer(many=True, read_only=True)
    project = serializers.PrimaryKeyRelatedField(queryset=Project.objects.all())  # ✅ FIXED

    class Meta:
        model = Issue
        fields = (
            'id','title','description','project','reporter',
            'assignees','status','priority','created_at','updated_at','comments'
        )
        read_only_fields = ('reporter','created_at','updated_at')

    def create(self, validated_data):
        assignees = validated_data.pop('assignees', [])
        issue = Issue.objects.create(**validated_data)
        if assignees:
            issue.assignees.set(assignees)
        return issue
