from rest_framework import serializers
from back.models import TestClass

#TestClass Serializer
class TestClassSerializer (serializers.ModelSerializer):
    class Meta:
        model = TestClass
        fields = '__all__'