# Create your models here.
# backend/projects/models.py
from django.db import models
from django.conf import settings

class Project(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='owned_projects', on_delete=models.CASCADE)
    members = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='projects', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Dashboard fields
    start_date = models.DateField(null=True, blank=True, help_text="Project start date")
    end_date = models.DateField(null=True, blank=True, help_text="Project end date")
    funds_allocated = models.DecimalField(
        max_digits=12, 
        decimal_places=2, 
        null=True, 
        blank=True,
        help_text="Budget allocated to the project"
    )

    def __str__(self):
        return self.name
