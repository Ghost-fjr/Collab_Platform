# backend/users/api.py
# -----------------------------------------------------------------------------
# Authentication & User API
# - Provides JWT endpoints for login + token refresh
# - Adds user registration endpoint
# -----------------------------------------------------------------------------
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import RegisterView   # ✅ import our new view

urlpatterns = [
    # ✅ JWT Authentication
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # ✅ Registration
    path('register/', RegisterView.as_view(), name='user_register'),
]
