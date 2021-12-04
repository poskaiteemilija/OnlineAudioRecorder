from rest_framework import serializers
from back.models import TestClass, SessionInfo, AudioStorage

#TestClass Serializer
class TestClassSerializer (serializers.ModelSerializer):
    class Meta:
        model = TestClass
        fields = '__all__'

class SessionInfoSerializer (serializers.ModelSerializer):
    class Meta:
        model = SessionInfo
        fields = '__all__'

class AudioStorageSerializer (serializers.ModelSerializer):
    class Meta:
        model = AudioStorage
        fields = '__all__'
        