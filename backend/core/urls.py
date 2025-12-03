# backend/core/urls.py
# -----------------------------------------------------------------------------
# Core URL Configuration
# - Registers API routes for projects, issues, comments, notifications, and users
# - Includes JWT authentication endpoints from users/api.py
# -----------------------------------------------------------------------------
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

# ✅ ViewSets
from projects.views import ProjectViewSet
from issues.views import IssueViewSet, CommentViewSet
from notifications.views import NotificationViewSet
from users.views import UserViewSet   # <-- NEW
from chat.views import ChatRoomViewSet, MessageViewSet  # <-- NEW

# ---------- API Router ----------
router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'issues', IssueViewSet, basename='issue')
router.register(r'comments', CommentViewSet, basename='comment')
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'users', UserViewSet, basename='user')   # <-- NEW
router.register(r'chat-rooms', ChatRoomViewSet, basename='chatroom')  # <-- NEW
router.register(r'messages', MessageViewSet, basename='message')  # <-- NEW

urlpatterns = [
    path('admin/', admin.site.urls),

    # ✅ Authentication (JWT endpoints live in users/api.py)
    path('api/auth/', include('users.api')),

    # API routes
    path('api/', include(router.urls)),
]
