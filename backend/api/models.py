"""
Star Auto - Django Models
"""

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone


class User(AbstractUser):
    """
    Custom User model extending Django's AbstractUser.
    """
    ROLE_CHOICES = [
        ('ADMIN', 'Administrateur'),
        ('CLIENT', 'Client'),
    ]
    
    telephone = models.CharField(max_length=20, blank=True, default='')
    address = models.CharField(max_length=255, blank=True, default='')
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='CLIENT')
    favorites = models.ManyToManyField('Car', blank=True, related_name='favorited_by')
    
    class Meta:
        verbose_name = 'Utilisateur'
        verbose_name_plural = 'Utilisateurs'
    
    def __str__(self):
        return self.username


class Car(models.Model):
    """
    Car model for the car dealership.
    """
    CARBURANT_CHOICES = [
        ('Essence', 'Essence'),
        ('Diesel', 'Diesel'),
        ('Électrique', 'Électrique'),
        ('Hybride', 'Hybride'),
        ('GPL', 'GPL'),
    ]
    
    TRANSMISSION_CHOICES = [
        ('Manuelle', 'Manuelle'),
        ('Automatique', 'Automatique'),
    ]
    
    marque = models.CharField(max_length=100)
    modele = models.CharField(max_length=100)
    annee = models.IntegerField()
    prix = models.DecimalField(max_digits=10, decimal_places=2)
    images = models.JSONField(default=list)
    description = models.TextField()
    kilometrage = models.IntegerField(default=0)
    carburant = models.CharField(max_length=20, choices=CARBURANT_CHOICES, default='Essence')
    transmission = models.CharField(max_length=20, choices=TRANSMISSION_CHOICES, default='Manuelle')
    couleur = models.CharField(max_length=50, default='Noir')
    disponibilite = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Voiture'
        verbose_name_plural = 'Voitures'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['marque', 'modele']),
            models.Index(fields=['annee']),
            models.Index(fields=['prix']),
        ]
    
    def __str__(self):
        return f"{self.annee} {self.marque} {self.modele}"


class Message(models.Model):
    """
    Contact message model.
    """
    nom = models.CharField(max_length=100)
    email = models.EmailField()
    sujet = models.CharField(max_length=200, blank=True, default='')
    message = models.TextField()
    telephone = models.CharField(max_length=20, blank=True, default='')
    voiture = models.ForeignKey(Car, on_delete=models.SET_NULL, null=True, blank=True, related_name='messages')
    lu = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Message'
        verbose_name_plural = 'Messages'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Message de {self.nom} - {self.sujet or 'Sans sujet'}"
