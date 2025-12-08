const Contact = require('../models/Contact');
const asyncHandler = require('express-async-handler');

// @desc    Submit a contact form
// @route   POST /api/contact
// @access  Public
const createContact = asyncHandler(async (req, res) => {
    const newContact = new Contact(req.body);
    const savedContact = await newContact.save();
    res.status(201).json(savedContact);
});

module.exports = {
    createContact
};
