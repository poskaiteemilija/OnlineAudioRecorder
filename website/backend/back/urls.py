from rest_framework import routers
from .api import TestClassViewSet, SessionInfoViewSet, AudioStorageViewSet
#from .views import upload_file

router = routers.DefaultRouter()
router.register('api/back', TestClassViewSet, 'back')
router.register('api/session', SessionInfoViewSet, 'session')
router.register('api/upload', AudioStorageViewSet, 'upload')

urlpatterns = router.urls