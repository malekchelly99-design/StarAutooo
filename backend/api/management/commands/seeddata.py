"""
Management command to seed initial data for Star Auto.
"""

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from api.models import Car, Message

User = get_user_model()


class Command(BaseCommand):
    help = 'Seeds the database with initial data'
    
    def handle(self, *args, **options):
        self.stdout.write('Seeding database...')
        
        # Create admin user
        if not User.objects.filter(username='admin').exists():
            admin = User.objects.create_superuser(
                username='admin',
                email='admin@starauto.com',
                password='admin123',
                role='ADMIN',
                nom='Administrateur'
            )
            self.stdout.write(self.style.SUCCESS(f'Created admin user: {admin.username}'))
        
        # Create sample cars
        if not Car.objects.exists():
            cars = [
                {
                    'marque': 'BMW',
                    'modele': 'X5',
                    'annee': 2023,
                    'prix': 55000,
                    'images': ['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800'],
                    'description': 'BMW X5 xDrive40i - Luxe et performance',
                    'kilometrage': 5000,
                    'carburant': 'Essence',
                    'transmission': 'Automatique',
                    'couleur': 'Noir',
                    'disponibilite': True
                },
                {
                    'marque': 'Mercedes',
                    'modele': 'GLE',
                    'annee': 2023,
                    'prix': 62000,
                    'images': ['https://images.unsplash.com/photo-1533473359331-0135ef1bcfb0?w=800'],
                    'description': 'Mercedes GLE 400d - Élégance et confort',
                    'kilometrage': 3000,
                    'carburant': 'Diesel',
                    'transmission': 'Automatique',
                    'couleur': 'Blanc',
                    'disponibilite': True
                },
                {
                    'marque': 'Audi',
                    'modele': 'A6',
                    'annee': 2022,
                    'prix': 45000,
                    'images': ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'],
                    'description': 'Audi A6 45 TFSI - Berline premium',
                    'kilometrage': 15000,
                    'carburant': 'Essence',
                    'transmission': 'Automatique',
                    'couleur': 'Gris',
                    'disponibilite': True
                },
                {
                    'marque': 'Tesla',
                    'modele': 'Model 3',
                    'annee': 2023,
                    'prix': 42000,
                    'images': ['https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800'],
                    'description': 'Tesla Model 3 Long Range - 100% Electrique',
                    'kilometrage': 8000,
                    'carburant': 'Electrique',
                    'transmission': 'Automatique',
                    'couleur': 'Blanc',
                    'disponibilite': True
                },
                {
                    'marque': 'Peugeot',
                    'modele': '508',
                    'annee': 2022,
                    'prix': 35000,
                    'images': ['https://images.unsplash.com/photo-1532680439576-1d73c8fd637f?w=800'],
                    'description': 'Peugeot 508 PSE - Hybrid rechargeable',
                    'kilometrage': 12000,
                    'carburant': 'Hybride',
                    'transmission': 'Automatique',
                    'couleur': 'Gris',
                    'disponibilite': True
                },
                {
                    'marque': 'Renault',
                    'modele': 'Arkana',
                    'annee': 2023,
                    'prix': 28000,
                    'images': ['https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800'],
                    'description': 'Renault Arkana E-Tech - SUV Coupe',
                    'kilometrage': 5000,
                    'carburant': 'Hybride',
                    'transmission': 'Automatique',
                    'couleur': 'Noir',
                    'disponibilite': True
                },
                {
                    'marque': 'Volkswagen',
                    'modele': 'Golf',
                    'annee': 2023,
                    'prix': 32000,
                    'images': ['https://images.unsplash.com/photo-1570162148006-ca4f2a92df90?w=800'],
                    'description': 'Volkswagen Golf 8 GTE - Hybride rechargeable',
                    'kilometrage': 2000,
                    'carburant': 'Hybride',
                    'transmission': 'Automatique',
                    'couleur': 'Rouge',
                    'disponibilite': True
                },
                {
                    'marque': 'Toyota',
                    'modele': 'Rav4',
                    'annee': 2023,
                    'prix': 38000,
                    'images': ['https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800'],
                    'description': 'Toyota RAV4 Hybrid - Le roi du SUV',
                    'kilometrage': 10000,
                    'carburant': 'Hybride',
                    'transmission': 'Automatique',
                    'couleur': 'Blanc',
                    'disponibilite': True
                },
            ]
            
            for car_data in cars:
                Car.objects.create(**car_data)
            
            self.stdout.write(self.style.SUCCESS(f'Created {len(cars)} sample cars'))
        
        # Create sample messages
        if not Message.objects.exists():
            messages = [
                {
                    'nom': 'Jean Dupont',
                    'email': 'jean.dupont@email.com',
                    'sujet': 'Question sur la BMW X5',
                    'message': 'Bonjour, je suis interesse par la BMW X5. Est-elle disponible pour un essai?',
                    'telephone': '+33 6 12 34 56 78',
                    'lu': False
                },
                {
                    'nom': 'Marie Martin',
                    'email': 'marie.martin@email.com',
                    'sujet': 'Demande de devis',
                    'message': 'Bonjour, je souhaiterais obtenir un devis pour la Mercedes GLE.',
                    'telephone': '+33 6 98 76 54 32',
                    'lu': True
                },
            ]
            
            for msg_data in messages:
                Message.objects.create(**msg_data)
            
            self.stdout.write(self.style.SUCCESS(f'Created {len(messages)} sample messages'))
        
        self.stdout.write(self.style.SUCCESS('Database seeding completed!'))
        self.stdout.write('')
        self.stdout.write('Login credentials:')
        self.stdout.write('  Admin: admin@starauto.com / admin123')
