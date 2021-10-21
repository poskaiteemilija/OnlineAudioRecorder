from back.models import TestClass, SessionInfo
from rest_framework import viewsets, permissions
from .serializers import TestClassSerializer, SessionInfoSerializer

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