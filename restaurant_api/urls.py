from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

router = DefaultRouter()
router.register('categories', views.CategorieViewSet)
router.register('plats', views.PlatViewSet, basename='plat')
router.register('commandes', views.CommandeViewSet, basename='commande')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/inscription/', views.inscription),
    path('auth/connexion/', views.connexion),
    path('auth/profil/', views.mon_profil),
    path('auth/refresh/', TokenRefreshView.as_view()),
]