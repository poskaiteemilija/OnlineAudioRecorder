from django.shortcuts import render
from django.http import HttpResponseRedirect
from .forms import UploadAudioForm
from django.middleware.csrf import get_token
from django.http import JsonResponse

# Create your views here.

def start_session(request):
    response = JsonResponse({'detail': 'session created'})
    response['X-CSRFToken'] = get_token(request)
    return response

