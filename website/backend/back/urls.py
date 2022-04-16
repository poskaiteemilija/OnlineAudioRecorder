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
    path('api/delete/<pk>', AudioStorageViewSet.as_view({'delete':'destroy'})),
    path('', include(router.urls)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    from django.contrib.staticfiles.urls import staticfiles_urlpatterns
    from django.conf.urls.static import static

    urlpatterns += staticfiles_urlpatterns()
    urlpatterns += static(
        settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)