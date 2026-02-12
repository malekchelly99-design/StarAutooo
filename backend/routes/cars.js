const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Car = require('../models/Car');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/cars
// @desc    Get all cars
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { marque, minPrice, maxPrice, annee, search, sort } = req.query;
    
    let query = {};
    
    // Filters
    if (marque) query.marque = { $regex: marque, $options: 'i' };
    if (annee) query.annee = annee;
    if (minPrice || maxPrice) {
      query.prix = {};
      if (minPrice) query.prix.$gte = Number(minPrice);
      if (maxPrice) query.prix.$lte = Number(maxPrice);
    }
    if (search) {
      query.$or = [
        { marque: { $regex: search, $options: 'i' } },
        { modele: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === 'price-asc') sortOption = { prix: 1 };
    if (sort === 'price-desc') sortOption = { prix: -1 };
    if (sort === 'year-desc') sortOption = { annee: -1 };
    if (sort === 'year-asc') sortOption = { annee: 1 };
    
    const cars = await Car.find(query).sort(sortOption);
    
    res.status(200).json({
      success: true,
      count: cars.length,
      data: cars
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/cars/:id
// @desc    Get single car
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: car
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/cars
// @desc    Create new car
// @access  Private (ADMIN only)
router.post('/', [
  protect,
  authorize('ADMIN'),
  body('marque').notEmpty().withMessage('Marque is required'),
  body('modele').notEmpty().withMessage('Modèle is required'),
  body('annee').isNumeric().withMessage('Année is required'),
  body('prix').isNumeric().withMessage('Prix is required'),
  body('description').notEmpty().withMessage('Description is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const car = await Car.create(req.body);
    
    res.status(201).json({
      success: true,
      data: car
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/cars/:id
// @desc    Update car
// @access  Private (ADMIN only)
router.put('/:id', protect, authorize('ADMIN'), async (req, res) => {
  try {
    let car = await Car.findById(req.params.id);
    
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }
    
    car = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: car
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/cars/:id
// @desc    Delete car
// @access  Private (ADMIN only)
router.delete('/:id', protect, authorize('ADMIN'), async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }
    
    await car.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Car deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
