from rest_framework import routers
from django.urls import path, include
from .api import AudioStorageViewSet
from . import views
from django.conf import settings
from django.conf.urls.static import static


router = routers.DefaultRouter()
router.register('api/upload', AudioStorageViewSet, 'upload')

urlpatterns = [
    path('api/export', views.ExportAudioAPI.as_view(), name='export'),
    path('', include(router.urls)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)