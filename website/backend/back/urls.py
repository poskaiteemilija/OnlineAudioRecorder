from rest_framework import routers
from .api import TestClassViewSet, SessionInfoViewSet

router = routers.DefaultRouter()
router.register('api/back', TestClassViewSet, 'back')
router.register('api/session', SessionInfoViewSet, 'session')

urlpatterns = router.urls