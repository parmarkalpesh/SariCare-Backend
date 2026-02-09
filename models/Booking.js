const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Optional for now to support guest bookings if needed, or migration
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number']
    },
    address: {
        type: String,
        required: [true, 'Address is required']
    },
    pickupDate: {
        type: Date,
        required: [true, 'Pickup date is required']
    },
    preferredTime: {
        type: String,
        required: [true, 'Preferred time is required'],
        enum: ['Morning (9 AM - 12 PM)', 'Afternoon (12 PM - 4 PM)', 'Evening (4 PM - 8 PM)']
    },
    status: {
        type: String,
        default: 'Pending',
        trim: true,
        enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled']
    },
    transactionId: {
        type: String,
        trim: true
    },
    items: [{
        service: { type: String, required: true },
        quantity: { type: Number, default: 1 },
        price: String
    }],
    totalAmount: {
        type: Number,
        default: 0
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Pending'
    },
    healthReport: {
        condition: {
            type: String,
            enum: ['Excellent', 'Good', 'Fair', 'Needs Repair'],
            default: 'Good'
        },
        notes: String,
        recommendation: String
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
