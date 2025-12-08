const mongoose = require('mongoose');
const colors = require('colors');

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
    if (cached.conn) {
        // console.log('Using cached MongoDB connection'.cyan.underline.bold);
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        };

        cached.promise = mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/saricare', opts).then((mongoose) => {
            console.log(`MongoDB Connected: ${mongoose.connection.host}`.cyan.underline.bold);
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        console.error(`Error: ${e.message}`.red.bold);
        throw e;
    }

    return cached.conn;
};

module.exports = connectDB;
