from back.models import AudioStorage
from rest_framework import viewsets, permissions
from .serializers import AudioStorageSerializer

class AudioStorageViewSet(viewsets.ModelViewSet):
    queryset = AudioStorage.objects.all()
    print("this is the queryset")
    print(queryset)
    serializer_class = AudioStorageSerializer