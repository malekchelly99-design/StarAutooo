const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Nom is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true
  },
  sujet: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    required: [true, 'Message is required']
  },
  telephone: {
    type: String,
    default: ''
  },
  voiture: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    default: null
  },
  lu: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Message', messageSchema);
