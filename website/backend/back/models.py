from django.db import models

class TestClass (models.Model):
    message = models.CharField(max_length=50)
    added_at = models.DateTimeField(auto_now_add=True)