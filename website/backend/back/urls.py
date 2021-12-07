from rest_framework import routers
from django.urls import path, include
from .api import TestClassViewSet, SessionInfoViewSet, AudioStorageViewSet
from .views import start_session

router = routers.DefaultRouter()
router.register('api/back', TestClassViewSet, 'back')
router.register('api/session', SessionInfoViewSet, 'session')
router.register('api/upload', AudioStorageViewSet, 'upload')

urlpatterns = [
    path('api/csrf/', start_session, name="api-csrf"),
    path('', include(router.urls)),
]