from rest_framework import serializers
from back.models import TestClass, SessionInfo

#TestClass Serializer
class TestClassSerializer (serializers.ModelSerializer):
    class Meta:
        model = TestClass
        fields = '__all__'

class SessionInfoSerializer (serializers.ModelSerializer):
    class Meta:
        model = SessionInfo
        fields = '__all__'