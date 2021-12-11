from django.shortcuts import render
from django.http import FileResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from back.models import AudioStorage
from .encoder import convert_audio
import os
import time

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
        dest_path = '.\\temp\\' + file_name + "." + file_format
        convert_audio(recording.audio_file.path, file_format, dest_path)
        while(os.path.isfile(dest_path) != True):
            time.sleep(0.5)

        return FileResponse(open(dest_path, "rb"))

