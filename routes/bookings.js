const express = require('express');
const router = express.Router();
const { createBooking, getUserBookings, getBookingById } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST api/bookings
// @desc    Create a new booking
// @access  Public (Modified to support auth)
router.post('/', protect, createBooking);

// @route   GET api/bookings/mybookings
// @desc    Get logged in user bookings
// @access  Private
router.get('/mybookings', protect, getUserBookings);

// @route   GET api/bookings/:id
// @desc    Get booking by ID
// @access  Public
router.get('/:id', getBookingById);

module.exports = router;
