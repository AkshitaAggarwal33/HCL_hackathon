// backend/routes/provider.js
const express = require('express');
const { auth, authorizeRoles } = require('../middleware/authMiddleware');
const Goal = require('../models/Goal');
const User = require('../models/User');

const router = express.Router();

const getToday = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

// GET /api/provider/patients
router.get('/patients', auth, authorizeRoles('provider'), async (req, res) => {
  try {
    const today = getToday();
    const patients = await User.find({ role: 'patient' }).select('-password');

    const patientIds = patients.map((p) => p._id);
    const goals = await Goal.find({ userId: { $in: patientIds }, date: today });
    const goalMap = {};
    goals.forEach((g) => { goalMap[g.userId.toString()] = g; });

    const result = patients.map((p) => {
      const goal = goalMap[p._id.toString()];
      const steps = goal ? goal.steps : 0;
      const compliance = steps >= 6000 ? 'Goal Met' : 'Pending';
      return {
        id: p._id,
        name: p.name,
        email: p.email,
        allergies: p.allergies,
        medications: p.medications,
        stepsToday: steps,
        compliance
      };
    });

    res.json(result);
  } catch (err) {
    console.error('Provider patients error:', err.message || err);
    res.status(500).json({ message: 'Error fetching patients' });
  }
});

// GET /api/provider/patient/:id
router.get('/patient/:id', auth, authorizeRoles('provider'), async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await User.findById(id).select('-password');
    if (!patient || patient.role !== 'patient') return res.status(404).json({ message: 'Patient not found' });

    const goals = await Goal.find({ userId: id }).sort({ date: -1 }).limit(7);
    res.json({
      patient: {
        id: patient._id,
        name: patient.name,
        email: patient.email,
        allergies: patient.allergies,
        medications: patient.medications
      },
      goals
    });
  } catch (err) {
    console.error('Provider patient detail error:', err.message || err);
    res.status(500).json({ message: 'Error fetching patient detail' });
  }
});

module.exports = router;
