from back.models import TestClass
from rest_framework import viewsets, permissions
from .serializers import TestClassSerializer

#TestClass Viewset
class TestClassViewSet(viewsets.ModelViewSet):
    queryset = TestClass.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = TestClassSerializer