from django.contrib import admin
from .models import Issue, Comment

# Register your models here.

@admin.register(Issue)
class IssueAdmin(admin.ModelAdmin):
    list_display = ('title', 'project', 'reporter', 'status', 'priority', 'created_at')
    list_filter = ('status','priority','project')

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('issue','author','created_at')
