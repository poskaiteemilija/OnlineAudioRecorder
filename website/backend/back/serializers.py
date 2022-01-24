from rest_framework import serializers
from back.models import AudioStorage

class AudioStorageSerializer (serializers.ModelSerializer):
    class Meta:
        model = AudioStorage
        fields = '__all__'
        