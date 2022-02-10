from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from back.models import AudioStorage
from .encoder import convert_audio
import os
import time
from django.conf import settings
from django.core.files import File

# Create your views here.

class ExportAudioAPI(APIView):
    def post(self, request, format=None):
        session_id = request.POST['session']
        file_format = request.POST['format']
        file_name = request.POST['filename']
        print(session_id, file_format, file_name)
        #!!!!!concerns for sql injection:
        recording = AudioStorage.objects.get(session=session_id)
        print(recording.audio_file.path)
        dest_path = settings.MEDIA_ROOT + '\\temp\\' + session_id + "." + file_format
        convert_audio(recording.audio_file.path, file_format, dest_path)
        #very inefficient way to write files
        while(os.path.isfile(dest_path) != True):
            time.sleep(0.5)

        new_file = open(dest_path, "rb")
        AudioStorage.objects.get(session=session_id).delete()

        AudioStorage.objects.create(session=session_id, audio_file=File(new_file))
        link = AudioStorage.objects.get(session=session_id).audio_file.url
        #os.remove(dest_path)

        return HttpResponse(link, content_type='text/plain')


