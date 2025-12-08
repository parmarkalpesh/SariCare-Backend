const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    firstName: { type: String, required: [true, 'First name is required'] },
    lastName: { type: String, required: [true, 'Last name is required'] },
    email: {
        type: String,
        required: [true, 'Email is required'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
    },
    phone: { type: String, required: [true, 'Phone number is required'] },
    message: { type: String, required: [true, 'Message is required'] },
    status: {
        type: String,
        enum: ['New', 'Replied'],
        default: 'New'
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contact', contactSchema);
