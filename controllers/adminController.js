const User = require('../models/User');
const Booking = require('../models/Booking');
const Contact = require('../models/Contact');
const asyncHandler = require('express-async-handler');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
    const userCount = await User.countDocuments({ role: 'user' });
    const bookingCount = await Booking.countDocuments();

    // Get counts by status
    const pendingCount = await Booking.countDocuments({ status: 'Pending' });
    const workingCount = await Booking.countDocuments({ status: 'Working' });
    const completedCount = await Booking.countDocuments({ status: 'Completed' });

    res.json({
        userCount,
        bookingCount,
        statusCounts: {
            pending: pendingCount,
            working: workingCount,
            completed: completedCount
        }
    });
});

// @desc    Get all bookings
// @route   GET /api/admin/bookings
// @access  Private/Admin
const getAllBookings = asyncHandler(async (req, res) => {
    const bookings = await Booking.find()
        .populate('user', 'name email')
        .sort({ createdAt: -1 });
    res.json(bookings);
});

// @desc    Update booking status
// @route   PUT /api/admin/bookings/:id/status
// @access  Private/Admin
const updateBookingStatus = asyncHandler(async (req, res) => {
    const { status, totalAmount, paymentStatus } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (booking) {
        if (status) booking.status = status;
        if (totalAmount !== undefined) booking.totalAmount = totalAmount;
        if (paymentStatus) booking.paymentStatus = paymentStatus;

        const updatedBooking = await booking.save();
        res.json(updatedBooking);
    } else {
        res.status(404);
        throw new Error('Booking not found');
    }
});

// @desc    Get all contacts
// @route   GET /api/admin/contacts
// @access  Private/Admin
const getAllContacts = asyncHandler(async (req, res) => {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
});

// @desc    Update contact status
// @route   PUT /api/admin/contacts/:id/status
// @access  Private/Admin
const updateContactStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const contact = await Contact.findById(req.params.id);

    if (contact) {
        contact.status = status;
        const updatedContact = await contact.save();
        res.json(updatedContact);
    } else {
        res.status(404);
        throw new Error('Contact message not found');
    }
});

// @desc    Update booking health report
// @route   PUT /api/admin/bookings/:id/health-report
// @access  Private/Admin
const updateHealthReport = asyncHandler(async (req, res) => {
    const { condition, notes, recommendation } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (booking) {
        booking.healthReport = {
            condition,
            notes,
            recommendation
        };
        const updatedBooking = await booking.save();
        res.json(updatedBooking);
    } else {
        res.status(404);
        throw new Error('Booking not found');
    }
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
    res.json(users);
});

module.exports = {
    getDashboardStats,
    getAllBookings,
    updateBookingStatus,
    getAllContacts,
    updateContactStatus,
    getAllUsers,
    updateHealthReport
};
