const express = require('express');
const router = express.Router();
const { createModel } = require('../database');
const { protect } = require('../middleware/auth');

// Use JSON DB for now
const User = createModel('users');
const Car = createModel('cars');

// @route   GET /api/favorites
// @desc    Get user's favorite cars
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Get favorite cars
    const favorites = [];
    for (const favId of user.favorites) {
      const car = await Car.findById(favId);
      if (car) favorites.push(car);
    }
    
    res.status(200).json({
      success: true,
      count: favorites.length,
      favorites
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/favorites/:carId
// @desc    Add a car to favorites
// @access  Private
router.post('/:carId', protect, async (req, res) => {
  try {
    const car = await Car.findById(req.params.carId);
    
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }
    
    const user = await User.findById(req.user.id);
    
    // Check if already in favorites
    if (user.favorites.includes(req.params.carId)) {
      return res.status(400).json({
        success: false,
        message: 'Car already in favorites'
      });
    }
    
    user.favorites.push(req.params.carId);
    await User.findByIdAndUpdate(req.user.id, { favorites: user.favorites });
    
    res.status(200).json({
      success: true,
      message: 'Car added to favorites',
      favorites: user.favorites
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/favorites/:carId
// @desc    Remove a car from favorites
// @access  Private
router.delete('/:carId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Check if in favorites
    if (!user.favorites.includes(req.params.carId)) {
      return res.status(400).json({
        success: false,
        message: 'Car not in favorites'
      });
    }
    
    user.favorites = user.favorites.filter(fav => fav.toString() !== req.params.carId);
    await User.findByIdAndUpdate(req.user.id, { favorites: user.favorites });
    
    res.status(200).json({
      success: true,
      message: 'Car removed from favorites',
      favorites: user.favorites
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/favorites/check/:carId
// @desc    Check if a car is in favorites
// @access  Private
router.get('/check/:carId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const isFavorite = user.favorites.includes(req.params.carId);
    
    res.status(200).json({
      success: true,
      isFavorite
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
