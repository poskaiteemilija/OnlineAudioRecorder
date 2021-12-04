from django.shortcuts import render
from django.http import HttpResponseRedirect
from .forms import UploadAudioForm

# Create your views here.

def handle_uploaded_file(f):
    with open('some/file/name.txt', 'wb+') as destination:
        for chunk in f.chunks():
            destination.write(chunk)
        destination.close()

def upload_file(request):
    if request.method == 'POST':
        form = UploadAudioForm(request.POST, request.FILES)
        if form.is_valid():
            # If we are here, the above file validation has completed
            # so we can now write the file to disk
            handle_uploaded_file(request.FILES['file'])
            return HttpResponseRedirect('/success/url/')
    else:
        form = UploadAudioForm()
    return render_to_response('upload.html', {'form': form})

