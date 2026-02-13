"""
Star Auto - API URL Configuration
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from . import views

router = DefaultRouter()
router.register(r'cars', views.CarViewSet, basename='car')
router.register(r'messages', views.MessageViewSet, basename='message')

urlpatterns = [
    # Router URLs
    path('', include(router.urls)),
    
    # Authentication
    path('auth/register/', views.register, name='register'),
    path('auth/login/', views.login, name='login'),
    path('auth/me/', views.me, name='me'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/profile/', views.update_profile, name='update_profile'),
    path('auth/password/', views.change_password, name='change_password'),
    
    # Favorites
    path('favorites/', views.favorites, name='favorites'),
    path('favorites/<int:car_id>/', views.favorites, name='favorite_detail'),
    path('favorites/check/<int:car_id>/', views.check_favorite, name='check_favorite'),
    
    # Admin
    path('admin/stats/', views.admin_stats, name='admin_stats'),
    path('admin/users/', views.admin_users, name='admin_users'),
    path('admin/users/<int:user_id>/', views.admin_user, name='admin_user'),
]
