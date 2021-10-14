from rest_framework import routers
from .api import TestClassViewSet

router = routers.DefaultRouter()
router.register('api/back', TestClassViewSet, 'back')

urlpatterns = router.urls