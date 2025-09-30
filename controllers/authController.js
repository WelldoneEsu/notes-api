const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const crypto = require('crypto');
const sendEmailOTP = require('../utils/sendMail');

// Helper to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

exports.signup = async (req, res) => {
  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, phone, password } = req.body;

  try {
    // Check if user exists
    let existing = await User.findOne({ $or: [{ email }, { phone }] });
    if (existing) {
      return res.status(400).json({ msg: 'User with email or phone already exists' });
    }

    // Create user
    const user = new User({
      name,
      email,
      phone,
      password   // will hash in pre-save
    });

    // If email OTP is required
    const otp = crypto.randomInt(100000, 999999).toString();
    user.emailOTP = otp;
    user.emailOTPExpires = Date.now() + 10 * 60 * 1000;  // 10 minutes expiration

    await user.save();

    // Send OTP via email
    await sendEmailOTP(email, otp);

    return res.status(201).json({ msg: 'User registered. Please verify email using OTP sent.' });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
};

exports.verifyEmailOTP = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ msg: 'Email and OTP are required' });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid email' });
    }
    if (user.isEmailVerified) {
      return res.status(400).json({ msg: 'Email already verified' });
    }
    if (user.emailOTP !== otp) {
      return res.status(400).json({ msg: 'Invalid OTP' });
    }
    if (user.emailOTPExpires < Date.now()) {
      return res.status(400).json({ msg: 'OTP expired' });
    }

    user.isEmailVerified = true;
    user.emailOTP = null;
    user.emailOTPExpires = null;
    await user.save();

    return res.status(200).json({ msg: 'Email verified successfully' });
  } catch (err) {
    console.error('verifyEmailOTP error:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
};

exports.login = async (req, res) => {
  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid email' });
    }

    //Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(400).json({ msg: 'Email not verified' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid password' });
    }

    const token = generateToken(user);
    return res.status(200).json({ token });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
};
