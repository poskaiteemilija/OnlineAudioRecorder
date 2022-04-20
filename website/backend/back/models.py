from django.db import models

class AudioStorage (models.Model):
    session = models.CharField(max_length=50)
    audio_file = models.FileField()
    volume = models.FloatField()