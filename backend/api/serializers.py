"""
Star Auto - Django REST Framework Serializers
"""

from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import Car, Message

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model."""
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'nom', 'telephone', 'address', 'role', 'favorites']
        read_only_fields = ['id', 'role', 'favorites']


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""
    
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'telephone']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Les mots de passe ne correspondent pas."})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            telephone=validated_data.get('telephone', ''),
            role='CLIENT'
        )
        return user


class CarSerializer(serializers.ModelSerializer):
    """Serializer for Car model."""
    
    class Meta:
        model = Car
        fields = [
            'id', 'marque', 'modele', 'annee', 'prix', 'images', 'description',
            'kilometrage', 'carburant', 'transmission', 'couleur', 'disponibilite',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class CarListSerializer(serializers.ModelSerializer):
    """Serializer for Car list view (lighter)."""
    
    class Meta:
        model = Car
        fields = [
            'id', 'marque', 'modele', 'annee', 'prix', 'images',
            'carburant', 'transmission', 'disponibilite'
        ]


class MessageSerializer(serializers.ModelSerializer):
    """Serializer for Message model."""
    
    class Meta:
        model = Message
        fields = [
            'id', 'nom', 'email', 'sujet', 'message', 'telephone',
            'voiture', 'lu', 'created_at'
        ]
        read_only_fields = ['id', 'lu', 'created_at']


class PasswordChangeSerializer(serializers.Serializer):
    """Serializer for password change."""
    
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    
    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Le mot de passe actuel est incorrect.")
        return value
