const Booking = require('../models/Booking');
const asyncHandler = require('express-async-handler');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Public
const createBooking = asyncHandler(async (req, res) => {
    const bookingData = {
        ...req.body,
        user: req.user ? req.user._id : null // Associate user if logged in
    };
    const newBooking = new Booking(bookingData);
    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
});

// @desc    Get user bookings
// @route   GET /api/bookings/mybookings
// @access  Private
const getUserBookings = asyncHandler(async (req, res) => {
    const bookings = await Booking.find({ user: req.user._id });
    res.status(200).json(bookings);
});

// @desc    Get booking by ID (Public for Payment Page)
// @route   GET /api/bookings/:id
// @access  Public
const getBookingById = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id);
    if (booking) {
        res.json(booking);
    } else {
        res.status(404);
        throw new Error('Booking not found');
    }
});

module.exports = {
    createBooking,
    getUserBookings,
    getBookingById
};
