const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  marque: {
    type: String,
    required: [true, 'Marque is required'],
    trim: true
  },
  modele: {
    type: String,
    required: [true, 'Modèle is required'],
    trim: true
  },
  annee: {
    type: Number,
    required: [true, 'Année is required'],
    min: [1900, 'Année must be after 1900'],
    max: [new Date().getFullYear() + 1, 'Année cannot be in the future']
  },
  prix: {
    type: Number,
    required: [true, 'Prix is required'],
    min: [0, 'Prix cannot be negative']
  },
  images: [{
    type: String,
    default: 'https://via.placeholder.com/800x600?text=No+Image'
  }],
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  kilometrage: {
    type: Number,
    default: 0
  },
  carburant: {
    type: String,
    enum: ['Essence', 'Diesel', 'Électrique', 'Hybride', 'GPL'],
    default: 'Essence'
  },
  transmission: {
    type: String,
    enum: ['Manuelle', 'Automatique'],
    default: 'Manuelle'
  },
  couleur: {
    type: String,
    default: 'Noir'
  },
  disponibilite: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create text index for search
carSchema.index({ marque: 'text', modele: 'text', description: 'text' });

module.exports = mongoose.model('Car', carSchema);
