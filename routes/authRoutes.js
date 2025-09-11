const express = require('express');
const { body } = require('express-validator');
const { signup, login, verifyEmailOTP } = require('../notes-api/controllers/authController');
const router = express.Router();

// Signup route
router.post(
  '/signup',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').isMobilePhone().withMessage('Valid phone number is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  signup
);

router.post(
  '/verify-email-otp',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('otp').isLength({ min: 5, max: 6 }).withMessage('OTP must be 5-6 digits')
  ],
  verifyEmailOTP
);

// Login route
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').exists().withMessage('Password is required')
],
login
);

module.exports = router;
