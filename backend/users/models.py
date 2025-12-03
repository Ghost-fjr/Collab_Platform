from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.
# backend/users/models.py

class User(AbstractUser):
    """
    Extend AbstractUser so we can add profile fields and roles later.
    Keep it small now: bio + role.
    """
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('maintainer', 'Maintainer'),
        ('developer', 'Developer'),
        ('viewer', 'Viewer'),
    )

    bio = models.TextField(blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='developer')

    def __str__(self):
        return self.username
