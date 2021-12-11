from rest_framework import routers
from django.urls import path, include
from .api import TestClassViewSet, SessionInfoViewSet, AudioStorageViewSet
from . import views

router = routers.DefaultRouter()
router.register('api/back', TestClassViewSet, 'back')
router.register('api/session', SessionInfoViewSet, 'session')
router.register('api/upload', AudioStorageViewSet, 'upload')

urlpatterns = [
    path('api/export', views.ExportAudioAPI.as_view(), name='export'),
    path('', include(router.urls)),
]