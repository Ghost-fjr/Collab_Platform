# backend/users/serializers.py
# -----------------------------------------------------------------------------
# User Serializers
# - UserSimpleSerializer: lightweight for references (projects, issues, etc.)
# - UserDetailSerializer: extended for profile / account details
# - UserRegisterSerializer: used for registration
# -----------------------------------------------------------------------------
from rest_framework import serializers
from .models import User


class UserSimpleSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for general usage
    (assignees in Issues, project members, etc.).
    """
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'role')


class UserDetailSerializer(serializers.ModelSerializer):
    """
    Extended serializer for profile and account details.
    Used when fetching a user's profile or editing account info.
    """
    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'first_name',
            'last_name',
            'email',
            'role',
            'bio',
            'date_joined',
            'last_login',
        )
        read_only_fields = ('id', 'date_joined', 'last_login')


class UserRegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration.
    - Validates unique username & email.
    - Hashes password before saving.
    """
    password = serializers.CharField(write_only=True, min_length=6)
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'first_name', 'last_name', 'email', 'role')

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username is already taken.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email is already registered.")
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)   # ✅ securely hash password
        user.save()
        return user
