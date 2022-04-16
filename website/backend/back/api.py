from back.models import AudioStorage
from rest_framework import viewsets, permissions
from .serializers import AudioStorageSerializer
from rest_framework.response import Response
from rest_framework import status

class AudioStorageViewSet(viewsets.ModelViewSet):
    queryset = AudioStorage.objects.all()
    serializer_class = AudioStorageSerializer

    def destroy(self, request, *args, **kwargs):
        item = self.get_object()
        print("in delete", item)
        item.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)
