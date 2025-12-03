# backend/users/views.py
# -----------------------------------------------------------------------------
# User Views
# - UserViewSet: read-only access to user data (list/retrieve + /me/)
# - RegisterView: public endpoint for new user registration
# -----------------------------------------------------------------------------
from rest_framework import viewsets, permissions, generics
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import User
from .serializers import (
    UserSimpleSerializer,
    UserDetailSerializer,
    UserRegisterSerializer,
)


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint to list and retrieve users.

    Permissions:
    - Authenticated users only (JWT required).
    - Future: extend with role-based restrictions.
    """
    queryset = User.objects.all().order_by('username')
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        """
        Use a detailed serializer when retrieving a single user.
        Default to lightweight serializer for list endpoints.
        """
        if self.action in ['retrieve', 'me']:
            return UserDetailSerializer
        return UserSimpleSerializer

    @action(detail=False, methods=['get'], url_path='me')
    def me(self, request):
        """
        Custom endpoint to return the currently authenticated user.
        GET /api/users/me/
        """
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)


class RegisterView(generics.CreateAPIView):
    """
    Public endpoint for user registration.

    - POST /api/auth/register/ -> create a new user
    """
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer
    permission_classes = [permissions.AllowAny]  # ✅ open to everyone
