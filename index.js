const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const colors = require('colors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const User = require('./models/User');

dotenv.config();

// Connect to database
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database (ensure connection on every request)
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({ error: 'Database connection failed' });
    }
});

// Security Middleware
app.use(helmet()); // Set security headers
app.use(xss()); // Prevent XSS attacks
app.use(mongoSanitize()); // Prevent NoSQL injection

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // Limit each IP to 200 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

// Middleware
app.use(cors());
app.use(express.json());

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Routes
const bookingRoutes = require('./routes/bookings');
const contactRoutes = require('./routes/contact');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

app.use('/api/bookings', bookingRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
    res.send('SariCare API is running');
});

// Error Handler Middleware (must be after routes)
app.use(errorHandler);

if (require.main === module) {
    const server = app.listen(PORT, async () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);

        // Seed Admin User
        try {
            await connectDB(); // Ensure connected for seeding
            const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL || 'admin@saricare.com' });
            if (!adminExists) {
                await User.create({
                    name: 'Admin',
                    email: process.env.ADMIN_EMAIL,
                    password: process.env.ADMIN_PASSWORD,
                    mobile: '0000000000',
                    gender: 'Other',
                    role: 'admin'
                });
                console.log('Admin user created'.green.bold);
            }
        } catch (error) {
            console.error('Error seeding admin user:', error);
        }
    });

    // Graceful Shutdown
    const gracefulShutdown = () => {
        console.log('Received kill signal, shutting down gracefully'.red.bold);
        server.close(() => {
            console.log('Closed out remaining connections'.red.bold);
            process.exit(0);
        });

        // Force close server after 10 secs
        setTimeout(() => {
            console.error('Could not close connections in time, forcefully shutting down'.red.bold);
            process.exit(1);
        }, 10000);
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
}

module.exports = app;
