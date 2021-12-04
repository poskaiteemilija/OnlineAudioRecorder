from back.models import TestClass, SessionInfo, AudioStorage
from rest_framework import viewsets, permissions
from .serializers import TestClassSerializer, SessionInfoSerializer, AudioStorageSerializer

#TestClass Viewset
class TestClassViewSet(viewsets.ModelViewSet):
    queryset = TestClass.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = TestClassSerializer

class SessionInfoViewSet(viewsets.ModelViewSet):
    queryset = SessionInfo.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = SessionInfoSerializer

class AudioStorageViewSet(viewsets.ModelViewSet):
    queryset = AudioStorage.objects.all()
    serializer_class = AudioStorageSerializer