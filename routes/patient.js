// backend/routes/patient.js
const express = require('express');
const { auth, authorizeRoles } = require('../middleware/authMiddleware');
const Goal = require('../models/Goal');
const Activity = require('../models/Activity');
const User = require('../models/User');

const router = express.Router();

const getToday = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

// GET /api/patient/dashboard
router.get('/dashboard', auth, authorizeRoles('patient'), async (req, res) => {
  try {
    const today = getToday();
    let todayGoal = await Goal.findOne({ userId: req.user._id, date: today });

    if (!todayGoal) {
      todayGoal = await Goal.findOne({ userId: req.user._id }).sort({ date: -1 });
    }

    const reminderMessage = todayGoal
      ? 'Stay consistent! Review and update your goals for today.'
      : 'You have not set goals for today yet. Create your daily wellness goals.';

    const tips = [
      'Take a 10-minute walk after meals to improve digestion.',
      'Stay hydrated throughout the day; aim for small sips regularly.',
      'Maintain a consistent sleep schedule, even on weekends.',
      'Practice 5 minutes of deep breathing to reduce stress.',
      'Limit screen time 1 hour before bed for better sleep quality.'
    ];
    const tipOfTheDay = tips[new Date().getDate() % tips.length];

    res.json({ goal: todayGoal || null, reminderMessage, tipOfTheDay });
  } catch (err) {
    console.error('Dashboard error:', err.message || err);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
});

// POST /api/patient/goals
router.post('/goals', auth, authorizeRoles('patient'), async (req, res) => {
  try {
    const today = getToday();
    const { steps = 0, water = 0, sleep = 0, activeMinutes = 0 } = req.body;

    const update = { steps, water, sleep, activeMinutes, date: today, userId: req.user._id };

    const goal = await Goal.findOneAndUpdate(
      { userId: req.user._id, date: today },
      update,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await Activity.create({ userId: req.user._id, action: 'Updated daily goals' });

    res.status(200).json(goal);
  } catch (err) {
    console.error('Goals error:', err.message || err);
    res.status(500).json({ message: 'Error saving goals' });
  }
});

// GET /api/patient/profile
router.get('/profile', auth, authorizeRoles('patient'), async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    console.error('Profile fetch error:', err.message || err);
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// PUT /api/patient/profile
router.put('/profile', auth, authorizeRoles('patient'), async (req, res) => {
  try {
    const { name, allergies, medications } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      {
        ...(name && { name }),
        ...(allergies !== undefined && { allergies }),
        ...(medications !== undefined && { medications })
      },
      { new: true }
    ).select('-password');

    await Activity.create({ userId: req.user._id, action: 'Updated profile' });

    res.json(updated);
  } catch (err) {
    console.error('Profile update error:', err.message || err);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

module.exports = router;
