const mongoose = require('mongoose');
const colors = require('colors');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/saricare', {
            maxPoolSize: 10, // Maintain up to 10 socket connections
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
    } catch (err) {
        console.error(`Error: ${err.message}`.red.bold);
        process.exit(1);
    }
};

module.exports = connectDB;
