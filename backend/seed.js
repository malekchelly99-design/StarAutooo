const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

// User Model
const User = require('./models/User');

// Car Model
const Car = require('./models/Car');

// Sample cars data
const carsData = [
  {
    marque: 'BMW',
    modele: 'X5',
    annee: 2023,
    prix: 255000, // 75 000 EUR ≈ 255 000 DT
    images: [
      'https://images.unsplash.com/photo-1556189250-72ba954e96b9?w=800',
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800'
    ],
    description: 'Le BMW X5 combine luxe et performance. Équipé d un moteur 3.0L biturbo diesel, il offre une puissance de 265 ch. Interior cuir, navigation GPS, caméra de recul.',
    kilometrage: 15000,
    carburant: 'Diesel',
    transmission: 'Automatique',
    couleur: 'Noir'
  },
  {
    marque: 'Mercedes-Benz',
    modele: 'C-Class',
    annee: 2022,
    prix: 153000, // 45 000 EUR ≈ 153 000 DT
    images: [
      'https://images.unsplash.com/photo-1618684479807-85f8e2cf676d?w=800',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800'
    ],
    description: 'La Mercedes-Benz C-Class incarne l élégance et la technologie. Moteur 2.0L turbo essence de 184 ch. Système MBUX, sièges chauffants,Toit ouvrant panoramique.',
    kilometrage: 25000,
    carburant: 'Essence',
    transmission: 'Automatique',
    couleur: 'Blanc'
  },
  {
    marque: 'Audi',
    modele: 'A4',
    annee: 2023,
    prix: 142800, // 42 000 EUR ≈ 142 800 DT
    images: [
      'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800',
      'https://images.unsplash.com/photo-1605559911161-206f7785a233?w=800'
    ],
    description: 'L Audi A4 berline offre un confort exceptionnel et une conduite dynamique. Moteur 2.0L TFSI 190 ch. Virtual Cockpit, navigation MMI, aide au stationnement.',
    kilometrage: 10000,
    carburant: 'Essence',
    transmission: 'Automatique',
    couleur: 'Gris'
  },
  {
    marque: 'Tesla',
    modele: 'Model 3',
    annee: 2023,
    prix: 163200, // 48 000 EUR ≈ 163 200 DT
    images: [
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800',
      'https://images.unsplash.com/photo-1532581140115-ca4d4e133c91?w=800'
    ],
    description: 'La Tesla Model 3 Long Range offre une autonomie de 602 km. 100% électrique avec une puissance de 351 ch. Autopilote, écran tactile 15 pouces, mise à jour à distance.',
    kilometrage: 8000,
    carburant: 'Électrique',
    transmission: 'Automatique',
    couleur: 'Rouge'
  },
  {
    marque: 'Volkswagen',
    modele: 'Golf',
    annee: 2022,
    prix: 95200, // 28 000 EUR ≈ 95 200 DT
    images: [
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800'
    ],
    description: 'La Volkswagen Golf 8 est un concentré de technologie. Moteur 1.5L TSI 130 ch. Écran digital 10, assistants de conduite, connectivité smartphone.',
    kilometrage: 20000,
    carburant: 'Essence',
    transmission: 'Manuelle',
    couleur: 'Bleu'
  },
  {
    marque: 'Peugeot',
    modele: '3008',
    annee: 2023,
    prix: 119000, // 35 000 EUR ≈ 119 000 DT
    images: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
      'https://images.unsplash.com/photo-1503376763036-066120622c74?w=800'
    ],
    description: 'Le Peugeot 3008 ALLURE offre un style unique et une technologies. Moteur 1.2L PureTech 130 ch. i-Cockpit 12.3", navigation 3D, aide au maintien de voie.',
    kilometrage: 12000,
    carburant: 'Essence',
    transmission: 'Automatique',
    couleur: 'Blanc'
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected...');

    // Clear existing data
    await User.deleteMany({});
    await Car.deleteMany({});
    console.log('Existing data cleared...');

    // Create admin user
    const adminUser = await User.create({
      email: 'admin@starauto.com',
      password: 'admin123',
      role: 'ADMIN'
    });
    console.log('Admin user created:', adminUser.email);

    // Create sample user
    const clientUser = await User.create({
      email: 'client@starauto.com',
      password: 'client123',
      role: 'CLIENT'
    });
    console.log('Client user created:', clientUser.email);

    // Create sample cars
    const cars = await Car.insertMany(carsData);
    console.log(`${cars.length} sample cars created...`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📧 Admin credentials:');
    console.log('   Email: admin@starauto.com');
    console.log('   Password: admin123');
    console.log('\n📧 Client credentials:');
    console.log('   Email: client@starauto.com');
    console.log('   Password: client123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
