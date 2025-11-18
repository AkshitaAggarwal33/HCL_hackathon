// backend/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Activity = require('../models/Activity');

const router = express.Router();

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, allergies, medications, consent } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashed,
      role,
      allergies: allergies || '',
      medications: medications || '',
      consent: !!consent
    });

    await Activity.create({ userId: user._id, action: 'User registered' });

    const token = generateToken(user);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        allergies: user.allergies,
        medications: user.medications,
        consent: user.consent,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    console.error('Register error:', err.message || err);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user);
    await Activity.create({ userId: user._id, action: 'User logged in' });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        allergies: user.allergies,
        medications: user.medications,
        consent: user.consent,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    console.error('Login error:', err.message || err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;
