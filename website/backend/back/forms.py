from django import forms

class UploadAudioForm(forms.ModelForm):
    session = forms.CharField(max_length=50)
    file = forms.FileField()