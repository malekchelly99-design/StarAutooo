"""
Star Auto - Django REST Framework Views
"""

from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.db.models import Q, Count
from django.shortcuts import get_object_or_404

from .models import Car, Message
from .serializers import (
    CarSerializer, CarListSerializer, MessageSerializer,
    UserSerializer, UserRegistrationSerializer, PasswordChangeSerializer
)

User = get_user_model()


class IsAdminUser:
    """Permission class to check if user is admin."""
    
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'ADMIN'


class CarViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Car CRUD operations.
    """
    queryset = Car.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return CarListSerializer
        return CarSerializer
    
    def get_queryset(self):
        queryset = Car.objects.all()
        
        # Filter by marque
        marque = self.request.query_params.get('marque')
        if marque:
            queryset = queryset.filter(marque__icontains=marque)
        
        # Filter by year
        annee = self.request.query_params.get('annee')
        if annee:
            queryset = queryset.filter(annee=annee)
        
        # Filter by price range
        min_price = self.request.query_params.get('minPrice')
        max_price = self.request.query_params.get('maxPrice')
        if min_price:
            queryset = queryset.filter(prix__gte=min_price)
        if max_price:
            queryset = queryset.filter(prix__lte=max_price)
        
        # Search
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(marque__icontains=search) | Q(modele__icontains=search)
            )
        
        # Sorting
        sort = self.request.query_params.get('sort')
        if sort == 'price-asc':
            queryset = queryset.order_by('prix')
        elif sort == 'price-desc':
            queryset = queryset.order_by('-prix')
        elif sort == 'year-desc':
            queryset = queryset.order_by('-annee')
        elif sort == 'year-asc':
            queryset = queryset.order_by('annee')
        else:
            queryset = queryset.order_by('-created_at')
        
        return queryset
    
    def create(self, request, *args, **kwargs):
        if not request.user.is_authenticated or request.user.role != 'ADMIN':
            return Response(
                {'message': 'Vous n\'êtes pas autorisé à effectuer cette action.'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().create(request, *args, **kwargs)
    
    def update(self, request, *args, **kwargs):
        if not request.user.is_authenticated or request.user.role != 'ADMIN':
            return Response(
                {'message': 'Vous n\'êtes pas autorisé à effectuer cette action.'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        if not request.user.is_authenticated or request.user.role != 'ADMIN':
            return Response(
                {'message': 'Vous n\'êtes pas autorisé à effectuer cette action.'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)


class MessageViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Message CRUD operations.
    """
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated(), IsAdminUser()]
    
    def get_queryset(self):
        if self.request.user.is_authenticated and self.request.user.role == 'ADMIN':
            return Message.objects.all().order_by('-created_at')
        return Message.objects.none()
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {'success': True, 'data': serializer.data},
            status=status.HTTP_201_CREATED
        )
    
    def destroy(self, request, *args, **kwargs):
        if not request.user.is_authenticated or request.user.role != 'ADMIN':
            return Response(
                {'message': 'Vous n\'êtes pas autorisé à effectuer cette action.'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)
    
    @action(detail=True, methods=['put'])
    def mark_read(self, request, pk=None):
        """Mark message as read."""
        if not request.user.is_authenticated or request.user.role != 'ADMIN':
            return Response(
                {'message': 'Vous n\'êtes pas autorisé à effectuer cette action.'},
                status=status.HTTP_403_FORBIDDEN
            )
        message = self.get_object()
        message.lu = True
        message.save()
        return Response({'success': True, 'data': MessageSerializer(message).data})


# Authentication Views
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """User registration endpoint."""
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'success': True,
            'token': str(refresh.access_token),
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)
    return Response({
        'success': False,
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """User login endpoint."""
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not email or not password:
        return Response(
            {'success': False, 'message': 'Email et mot de passe requis.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response(
            {'success': False, 'message': 'Identifiants invalides.'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    if not user.check_password(password):
        return Response(
            {'success': False, 'message': 'Identifiants invalides.'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    refresh = RefreshToken.for_user(user)
    return Response({
        'success': True,
        'token': str(refresh.access_token),
        'user': UserSerializer(user).data
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    """Get current user profile."""
    return Response({
        'success': True,
        'user': UserSerializer(request.user).data
    })


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    """Update user profile."""
    user = request.user
    serializer = UserSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({
            'success': True,
            'user': serializer.data
        })
    return Response({
        'success': False,
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    """Change user password."""
    serializer = PasswordChangeSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        request.user.set_password(serializer.validated_data['new_password'])
        request.user.save()
        return Response({
            'success': True,
            'message': 'Mot de passe modifié avec succès.'
        })
    return Response({
        'success': False,
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


# Favorites Views
@api_view(['GET', 'POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def favorites(request, car_id=None):
    """Manage user favorites."""
    user = request.user
    
    if request.method == 'GET':
        favorites = user.favorites.all()
        serializer = CarListSerializer(favorites, many=True)
        return Response({
            'success': True,
            'count': favorites.count(),
            'favorites': serializer.data
        })
    
    elif request.method == 'POST':
        if not car_id:
            return Response(
                {'success': False, 'message': 'ID de voiture requis.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        car = get_object_or_404(Car, id=car_id)
        if user.favorites.filter(id=car_id).exists():
            return Response(
                {'success': False, 'message': 'Cette voiture est déjà dans vos favoris.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        user.favorites.add(car)
        return Response({
            'success': True,
            'message': 'Voiture ajoutée aux favoris.'
        })
    
    elif request.method == 'DELETE':
        if not car_id:
            return Response(
                {'success': False, 'message': 'ID de voiture requis.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        car = get_object_or_404(Car, id=car_id)
        if not user.favorites.filter(id=car_id).exists():
            return Response(
                {'success': False, 'message': 'Cette voiture n\'est pas dans vos favoris.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        user.favorites.remove(car)
        return Response({
            'success': True,
            'message': 'Voiture supprimée des favoris.'
        })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_favorite(request, car_id):
    """Check if a car is in user's favorites."""
    user = request.user
    is_favorite = user.favorites.filter(id=car_id).exists()
    return Response({
        'success': True,
        'isFavorite': is_favorite
    })


# Admin Views
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_stats(request):
    """Get admin dashboard statistics."""
    if request.user.role != 'ADMIN':
        return Response(
            {'message': 'Vous n\'êtes pas autorisé à effectuer cette action.'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    total_cars = Car.objects.count()
    total_messages = Message.objects.count()
    unread_messages = Message.objects.filter(lu=False).count()
    total_users = User.objects.filter(role='CLIENT').count()
    
    return Response({
        'success': True,
        'stats': {
            'totalCars': total_cars,
            'totalMessages': total_messages,
            'unreadMessages': unread_messages,
            'totalUsers': total_users
        }
    })


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def admin_user(request, user_id):
    """Admin user management."""
    if request.user.role != 'ADMIN':
        return Response(
            {'message': 'Vous n\'êtes pas autorisé à effectuer cette action.'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    user = get_object_or_404(User, id=user_id)
    
    if request.method == 'GET':
        serializer = UserSerializer(user)
        return Response({
            'success': True,
            'user': serializer.data
        })
    
    elif request.method == 'PUT':
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'user': serializer.data
            })
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        if user.role == 'ADMIN':
            return Response(
                {'success': False, 'message': 'Impossible de supprimer un administrateur.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        user.delete()
        return Response({
            'success': True,
            'message': 'Utilisateur supprimé avec succès.'
        })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_users(request):
    """Get all users (admin only)."""
    if request.user.role != 'ADMIN':
        return Response(
            {'message': 'Vous n\'êtes pas autorisé à effectuer cette action.'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    users = User.objects.all().order_by('-date_joined')
    serializer = UserSerializer(users, many=True)
    return Response({
        'success': True,
        'count': users.count(),
        'users': serializer.data
    })
