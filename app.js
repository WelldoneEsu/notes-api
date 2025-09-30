const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors'); 
require('dotenv').config();
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes');
// Error handler
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Connect to database
connectDB();

// Apply security middleware
app.use(helmet());
app.use(cors()); 

// Parse incoming JSON requests
app.use(express.json());

// Rate limit on login route
const loginLimiter = rateLimit({
windowMs: 15 * 60 * 1000, // 15 minutes
max: 5, // max 5 login attempts per IP in window
message: {
msg: 'Too many login attempts, please try again after 15 minutes.'
 },
 standardHeaders: true,
 legacyHeaders: false
});

// Routes
// Apply the rate limiter specifically to the login route
app.use('/api/auth/login', loginLimiter); 
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

// Serve public frontend folder
app.use(express.static('public'));

// ✅ Global error handler
app.use(errorHandler);

module.exports = app;
