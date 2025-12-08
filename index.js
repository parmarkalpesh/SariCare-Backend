// app.js
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

// Connect to database (Lambda will reuse connection across warm invocations)
connectDB();

const app = express();

// ---------- Security Middleware ----------
app.use(helmet());          // Set security headers
app.use(xss());             // Prevent XSS attacks
app.use(mongoSanitize());   // Prevent NoSQL injection

// ---------- Rate Limiting ----------
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,                 // Limit each IP to 200 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// ---------- Common Middleware ----------
app.use(cors());
app.use(express.json());

// Logging (local/dev only usually)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ---------- Routes ----------
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

// ---------- Admin Seeding (run once per cold start) ----------
let adminSeeded = false;

const seedAdmin = async () => {
  if (adminSeeded) return;

  try {
    const email = process.env.ADMIN_EMAIL || 'admin@saricare.com';

    const adminExists = await User.findOne({ email });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email,
        password: process.env.ADMIN_PASSWORD,
        mobile: '0000000000',
        gender: 'Other',
        role: 'admin',
      });
      console.log('Admin user created'.green.bold);
    }

    adminSeeded = true;
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
};

// Run seeding middleware before handling requests
app.use(async (req, res, next) => {
  await seedAdmin();
  next();
});

// ---------- Error Handler (must be after routes) ----------
app.use(errorHandler);

module.exports = app;
