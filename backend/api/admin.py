"""
Star Auto - Django Admin Configuration
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Car, Message


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Admin configuration for User model."""
    
    list_display = ['username', 'email', 'nom', 'role', 'is_active', 'date_joined']
    list_filter = ['role', 'is_active', 'is_staff']
    search_fields = ['username', 'email', 'nom']
    ordering = ['-date_joined']
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Informations supplémentaires', {'fields': ('nom', 'telephone', 'address', 'role')}),
    )
    
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Informations supplémentaires', {'fields': ('nom', 'telephone', 'address', 'role')}),
    )


@admin.register(Car)
class CarAdmin(admin.ModelAdmin):
    """Admin configuration for Car model."""
    
    list_display = ['marque', 'modele', 'annee', 'prix', 'carburant', 'transmission', 'disponibilite', 'created_at']
    list_filter = ['marque', 'carburant', 'transmission', 'disponibilite', 'annee']
    search_fields = ['marque', 'modele', 'description']
    list_editable = ['disponibilite', 'prix']
    ordering = ['-created_at']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Informations générales', {
            'fields': ('marque', 'modele', 'annee', 'description')
        }),
        ('Prix et état', {
            'fields': ('prix', 'kilometrage', 'disponibilite')
        }),
        ('Caractéristiques', {
            'fields': ('carburant', 'transmission', 'couleur')
        }),
        ('Images', {
            'fields': ('images',)
        }),
    )


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    """Admin configuration for Message model."""
    
    list_display = ['nom', 'email', 'sujet', 'voiture', 'lu', 'created_at']
    list_filter = ['lu', 'created_at']
    search_fields = ['nom', 'email', 'message', 'sujet']
    list_editable = ['lu']
    ordering = ['-created_at']
    date_hierarchy = 'created_at'
    readonly_fields = ['created_at']
    
    fieldsets = (
        ('Expéditeur', {
            'fields': ('nom', 'email', 'telephone')
        }),
        ('Message', {
            'fields': ('sujet', 'message', 'voiture')
        }),
        ('Statut', {
            'fields': ('lu', 'created_at')
        }),
    )
