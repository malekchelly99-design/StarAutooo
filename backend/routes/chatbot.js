const express = require('express');
const router = express.Router();
const { createModel } = require('../database');

// Use JSON DB for now
const Car = createModel('cars');

// Car knowledge base for the chatbot
const carKnowledge = {
  carburants: {
    'Essence': 'Les moteurs essence sont parfaits pour les trajets urbains et les courtes distances. Ils offrent généralement une meilleure performance et un bruit de moteur caractéristique.',
    'Diesel': 'Les moteurs diesel sont économiques pour les longs trajets avec une consommation réduite. Idéaux pour les conducteur·rice·s qui parcourent beaucoup de kilomètres.',
    'Électrique': 'Les véhicules électriques sont écologiques, économiques à l\'usage et nécessitent peu d\'entretien. Parfaits pour la ville avec un rayon d\'action de 200-500km.',
    'Hybride': 'Les hybrides combinent un moteur thermique et un moteur électrique. Polyvalents et économiques, ils réduisent la consommation en ville.',
    'GPL': 'Le GPL est économique et écologique avec des émissions réduites de CO2. Une alternative intéressante pour les gros rouleurs.'
  },
  transmissions: {
    'Manuelle': 'La boîte manuelle offre plus de contrôle et une meilleure connection avec le véhicule. Économique et appréciée des conducteur·rice·s expérimentés.',
    'Automatique': 'La boîte automatique offre un confort optimal en ville. Plus facile à conduire, elle est devenue très populaire.'
  },
  conseils: {
    'achat': 'Pour bien choisir votre véhicule, considérez: votre budget, le type de trajets (ville/autoroute), le nombre de kilomètres annuels, vos besoins en espace et vos préférences de conduite.',
    'entretien': 'L\'entretien régulier comprend: vidange tous les 15-20km ou 1 an, vérification des pneus, contrôle des freins et des feux. Suivez le carnet d\'entretien du constructeur.',
    'financement': 'Plusieurs options: crédit auto classique, leasing (LOA) ou location avec option d\'achat (LDD). Comparez les taux et les conditions.',
    'document': 'Pour l\'achat: carte grise, contrôle technique (-6 mois), certificat de non-gage, facture d\'achat et garantie.'
  }
};

// Extract keywords from user message
const extractKeywords = (message) => {
  const lowerMessage = message.toLowerCase();
  const keywords = [];
  
  // Car brands (marques)
  const brands = ['renault', 'peugeot', 'citroën', 'citroen', 'Volkswagen', 'vw', 'audi', 'bmw', 'mercedes', 'ford', 'toyota', 'honda', 'nissan', 'fiat', 'opel', 'kia', 'hyundai'];
  brands.forEach(brand => {
    if (lowerMessage.includes(brand.toLowerCase())) {
      keywords.push({ type: 'brand', value: brand });
    }
  });
  
  // Fuel types
  const fuels = ['essence', 'diesel', 'électrique', 'electrique', 'hybride', 'gpl'];
  fuels.forEach(fuel => {
    if (lowerMessage.includes(fuel)) {
      keywords.push({ type: 'fuel', value: fuel });
    }
  });
  
  // Transmission
  if (lowerMessage.includes('automatique') || lowerMessage.includes('auto')) {
    keywords.push({ type: 'transmission', value: 'Automatique' });
  }
  if (lowerMessage.includes('manuelle') || lowerMessage.includes('manuel')) {
    keywords.push({ type: 'transmission', value: 'Manuelle' });
  }
  
  // Price questions
  if (lowerMessage.includes('prix') || lowerMessage.includes('cher') || lowerMessage.includes('budget') || lowerMessage.includes('coût') || lowerMessage.includes('coute')) {
    keywords.push({ type: 'price', value: 'asked' });
  }
  
  // Availability
  if (lowerMessage.includes('disponible') || lowerMessage.includes('stock') || lowerMessage.includes('a vendre') || lowerMessage.includes('à vendre')) {
    keywords.push({ type: 'availability', value: 'asked' });
  }
  
  // Model/year questions
  if (lowerMessage.includes('annee') || lowerMessage.includes('modèle') || lowerMessage.includes('modele') || lowerMessage.includes('nouveau') || lowerMessage.includes('neuve')) {
    keywords.push({ type: 'year', value: 'asked' });
  }
  
  // Advice questions
  if (lowerMessage.includes('conseil') || lowerMessage.includes('avis') || lowerMessage.includes('recommande') || lowerMessage.includes('quel') || lowerMessage.includes('quelle')) {
    keywords.push({ type: 'advice', value: 'asked' });
  }
  
  // Maintenance
  if (lowerMessage.includes('entretien') || lowerMessage.includes('révision') || lowerMessage.includes('revision') || lowerMessage.includes('panne') || lowerMessage.includes('problème') || lowerMessage.includes('probleme')) {
    keywords.push({ type: 'maintenance', value: 'asked' });
  }
  
  // Test drive
  if (lowerMessage.includes('essayer') || lowerMessage.includes('essai') || lowerMessage.includes('test')) {
    keywords.push({ type: 'test_drive', value: 'asked' });
  }
  
  // Contact
  if (lowerMessage.includes('contact') || lowerMessage.includes('contactez') || lowerMessage.includes('téléphoner') || lowerMessage.includes('telephoner') || lowerMessage.includes('appeler')) {
    keywords.push({ type: 'contact', value: 'asked' });
  }
  
  // Greetings
  if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut') || lowerMessage.includes('coucou') || lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    keywords.push({ type: 'greeting', value: 'present' });
  }
  
  return keywords;
};

// Generate response based on keywords and database query
const generateResponse = async (keywords, userMessage) => {
  // Greeting
  if (keywords.some(k => k.type === 'greeting')) {
    return "Bonjour ! 👋 Je suis l'assistant Star Auto. Je peux vous aider à trouver la voiture parfaite ou répondre à vos questions sur nos véhicules, financements, services et plus encore. Comment puis-je vous aider aujourd'hui ?";
  }
  
  // Get all cars from database for context
  const cars = await Car.find({ disponibilite: true }).limit(10);
  const carList = cars.map(c => `${c.marque} ${c.modele} (${c.annee}) - ${c.prix}€ - ${c.carburant} - ${c.transmission}`).join('\n');
  
  // Check for specific fuel type question
  const fuelKeyword = keywords.find(k => k.type === 'fuel');
  if (fuelKeyword && (userMessage.includes('c\'est quoi') || userMessage.includes('quest ce que') || userMessage.includes('qu\'est ce que') || userMessage.includes('comment') || userMessage.includes('avantage') || userMessage.includes('inconvénient'))) {
    const fuelMap = {
      'essence': 'Essence',
      'electrique': 'Électrique',
      'hybride': 'Hybride',
      'gpl': 'GPL'
    };
    const fuel = fuelMap[fuelKeyword.value] || fuelKeyword.value.charAt(0).toUpperCase() + fuelKeyword.value.slice(1);
    if (carKnowledge.carburants[fuel]) {
      return `${carKnowledge.carburants[fuel]}\n\nNos véhicules ${fuel} disponibles:\n${carList || 'Contactez-nous pour connaître nos stocks actuels.'}`;
    }
  }
  
  // Check for transmission question
  const transKeyword = keywords.find(k => k.type === 'transmission');
  if (transKeyword && (userMessage.includes('c\'est quoi') || userMessage.includes('comment') || userMessage.includes('différence') || userMessage.includes('difference') || userMessage.includes('avantage'))) {
    if (carKnowledge.transmissions[transKeyword.value]) {
      return `${carKnowledge.transmissions[transKeyword.value]}\n\nNos véhicules à boîte ${transKeyword.value.toLowerCase()}:\n${carList || 'Contactez-nous pour connaître nos stocks actuels.'}`;
    }
  }
  
  // Price question
  if (keywords.some(k => k.type === 'price')) {
    if (cars.length > 0) {
      const prices = cars.map(c => c.prix);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      return `💰 Nos véhicules sont disponibles à partir de ${minPrice}€ jusqu'à ${maxPrice}€.\n\nVoici quelques-unes de nos offres actuelles:\n${carList}\n\nNous proposons également des solutions de financement adaptées à votre budget. Souhaitez-vous que je vous en parle ?`;
    }
    return "Nous avons des véhicules pour tous les budgets ! Nos prix varient selon le modèle, l'année et l'état du véhicule. Venez découvrir nos offres ou contactez-nous pour une étude personnalisée.";
  }
  
  // Availability
  if (keywords.some(k => k.type === 'availability')) {
    if (cars.length > 0) {
      return `✅ Oui, nous avons plusieurs véhicules disponibles !\n\nVoici notre sélection actuelle:\n${carList}\n\nVenez les voir dans notre garage ou contactez-nous pour plus d'informations !`;
    }
    return "N'hésitez pas à nous contacter directement par téléphone ou via notre page contact pour connaître nos disponibilités actuelles. Nous recevons régulièrement de nouveaux véhicules.";
  }
  
  // Year/Model question
  if (keywords.some(k => k.type === 'year')) {
    if (cars.length > 0) {
      const years = [...new Set(cars.map(c => c.annee))].sort((a, b) => b - a);
      return `📅 Nous avons des véhicules de différentes années dans notre stock.\n\nAnnées disponibles: ${years.join(', ')}\n\nModels récents:\n${carList}`;
    }
    return "Nous avons des véhicules récents de différentes années. Consultez notre page 'Voitures' pour voir tous nos modèles ou contactez-nous pour des informations spécifiques.";
  }
  
  // Advice
  if (keywords.some(k => k.type === 'advice')) {
    return `💡 Voici quelques conseils pour bien choisir:\n\n${carKnowledge.conseils.achat}\n\n${carKnowledge.conseils.financement}\n\nN'hésitez pas à me poser des questions plus précises sur un type de véhicule particulier !`;
  }
  
  // Maintenance
  if (keywords.some(k => k.type === 'maintenance')) {
    return `🛠️ Entretien et services:\n\n${carKnowledge.conseils.entretien}\n\nNotre garage propose également le contrôle technique, les révisions et les réparations. Venez nous voir ou prenez rendez-vous !`;
  }
  
  // Test drive
  if (keywords.some(k => k.type === 'test_drive')) {
    return "🚗 Vous souhaitez essayer un véhicule ? C'est une excellente idée !\n\nContactez-nous au garage pour prendre rendez-vous. Nous sommes disponibles du lundi au samedi. Vous pourrez tester le véhicule de votre choix dans les meilleures conditions.";
  }
  
  // Contact
  if (keywords.some(k => k.type === 'contact')) {
    return "📞 Pour nous contacter:\n\n📍 Visitez notre page 'Contact' pour voir toutes nos informations.\n\n💬 Vous pouvez aussi nous appeler directement ou nous envoyer un message depuis le formulaire de contact.\n\nNous sommes là pour vous aider !";
  }
  
  // Brand search
  const brandKeyword = keywords.find(k => k.type === 'brand');
  if (brandKeyword) {
    const brandCars = cars.filter(c => c.marque.toLowerCase().includes(brandKeyword.value.toLowerCase()));
    if (brandCars.length > 0) {
      return `🚗 Véhicules ${brandKeyword.value} disponibles:\n\n${brandCars.map(c => `- ${c.marque} ${c.modele} (${c.annee}) - ${c.prix}€ - ${c.carburant} - ${c.transmission}`).join('\n')}\n\nPlus de détails? Consultez la fiche de chaque véhicule !`;
    }
    return `Nous n'avons pas de ${brandKeyword.value} en stock actuellement. N'hésitez pas à nous contacter pour être informé des prochaines arrivées ou consultez régulièrement notre catalogue !`;
  }
  
  // Default response with car suggestions
  if (cars.length > 0) {
    return `Je serais ravi de vous aider ! 😊\n\nVoici quelques-uns de nos véhicules disponibles:\n${carList}\n\nVous pouvez me poser des questions sur:\n• Les caractéristiques (marque, modèle, année)\n• Le type de carburant\n• La transmission\n• Le prix et le financement\n• L'entretien et les services\n\nComment puis-je vous guider vers votre futur véhicule ?`;
  }
  
  return "Je suis désolé, je n'ai pas bien compris votre question. 😊\n\nEssayez de me poser des questions sur:\n• Nos véhicules disponibles\n• Les types de carburant\n• Les boites de vitesses\n• Les prix et financements\n• L'entretien automobile\n\nQue souhaitez-vous savoir ?";
};

// Chatbot route
router.post('/', async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    
    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Le message est requis' });
    }
    
    // Extract keywords and generate response
    const keywords = extractKeywords(message);
    const response = await generateResponse(keywords, message);
    
    // Add to history
    const newHistory = [
      ...history.slice(-4), // Keep last 4 messages
      { role: 'user', content: message },
      { role: 'assistant', content: response }
    ];
    
    res.json({
      response,
      history: newHistory
    });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ error: 'Une erreur est survenue. Veuillez réessayer.' });
  }
});

// Get cars for chatbot context
router.get('/cars', async (req, res) => {
  try {
    const cars = await Car.find({ disponibilite: true })
      .select('marque modele annee prix carburant transmission kilometrage')
      .limit(20);
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des véhicules' });
  }
});

module.exports = router;
