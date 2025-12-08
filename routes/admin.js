const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllBookings, updateBookingStatus, getAllContacts, updateContactStatus, getAllUsers, updateHealthReport } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.get('/stats', protect, admin, getDashboardStats);
router.get('/bookings', protect, admin, getAllBookings);
router.get('/contacts', protect, admin, getAllContacts);
router.get('/users', protect, admin, getAllUsers);
router.put('/bookings/:id/status', protect, admin, updateBookingStatus);
router.put('/bookings/:id/health-report', protect, admin, updateHealthReport);
router.put('/contacts/:id/status', protect, admin, updateContactStatus);

module.exports = router;
