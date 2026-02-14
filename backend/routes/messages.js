const express = require('express');
const router = express.Router();
const { createModel } = require('../database');
const { protect, authorize } = require('../middleware/auth');

// Use JSON DB for now
const Message = createModel('messages');

// @route   GET /api/messages
// @desc    Get all messages with count
// @access  Private (ADMIN only)
router.get('/', protect, authorize('ADMIN'), async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    const nonLus = messages.filter(m => !m.lu).length;
    
    res.status(200).json({
      success: true,
      count: messages.length,
      messages,
      nonLus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/messages
// @desc    Create a new message
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { nom, email, sujet, message, telephone, voiture } = req.body;
    
    const newMessage = await Message.create({
      nom,
      email,
      sujet,
      message,
      telephone,
      voiture
    });
    
    res.status(201).json({
      success: true,
      data: newMessage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/messages/:id
// @desc    Update message (mark as read)
// @access  Private (ADMIN only)
router.put('/:id', protect, authorize('ADMIN'), async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }
    
    message.lu = true;
    await Message.findByIdAndUpdate(req.params.id, message);
    
    res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/messages/:id
// @desc    Delete message
// @access  Private (ADMIN only)
router.delete('/:id', protect, authorize('ADMIN'), async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }
    
    await Message.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
