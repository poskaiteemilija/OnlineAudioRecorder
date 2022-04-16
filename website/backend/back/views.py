from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from back.models import AudioStorage
from .encoder import convert_audio
import os
import time
import mimetypes
from django.conf import settings
from django.core.files import File
from wsgiref.util import FileWrapper

# Create your views here.

class ExportAudioAPI(APIView):
    def post(self, request, format=None):
        session_id = request.POST['session']
        file_format = request.POST['format']
        print(session_id, file_format)
        #!!!!!concerns for sql injection:
        recordings = AudioStorage.objects.filter(session=session_id)
        print(recordings)
        dest_path = settings.MEDIA_ROOT + '\\temp\\' + session_id + "." + file_format
        convert_audio(recordings, file_format, dest_path)
        #very inefficient way to write files
        while(os.path.isfile(dest_path) != True):
            time.sleep(0.5)

        objs = AudioStorage.objects.filter(session=session_id)
        for obj in objs:
            os.remove(obj.audio_file.path)
            obj.delete()

        new_file = open(dest_path, "rb")

        new_rec = AudioStorage()
        new_rec.session = session_id
        #new_rec.audio_file.name = dest_path
        new_rec.audio_file = File(new_file)
        new_rec.save()
        
        
        link = AudioStorage.objects.get(session=session_id).audio_file.url
        print(link)

        return HttpResponse(link, content_type='text/plain')