from django.db import models

#test model developed for future reference
class TestClass (models.Model):
    message = models.CharField(max_length=50)
    added_at = models.DateTimeField(auto_now_add=True)

#main storage in remote website
class SessionInfo (models.Model):
    sessionID = models.CharField(max_length=50) #to be fixed with restrictions the tokens are going to put in place later on
    audio = models.CharField(max_length=1000) #also to be edited later based on the requirement of path amount
    #https://stackoverflow.com/questions/22340258/list-field-in-model to be created: functions that convert json lists to string and vice versa

    #consider for the future: could the media files be stored in local storage and the server stores just the local paths to those files?

class AudioStorage (models.Model):
    session = models.CharField(max_length=50)
    audio_file = models.FileField(upload_to=".\\uploads\\")