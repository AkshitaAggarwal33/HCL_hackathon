// backend/routes/public.js
const express = require('express');
const router = express.Router();

// Static health information cards
const healthInfo = [
  {
    id: 1,
    title: 'COVID-19',
    text: 'Stay up to date with vaccinations, wash hands frequently, and wear masks in high-risk settings.'
  },
  {
    id: 2,
    title: 'Seasonal Flu',
    text: 'Get an annual flu shot, avoid close contact with sick individuals, and cover coughs and sneezes.'
  },
  {
    id: 3,
    title: 'Mental Health',
    text: 'Prioritize sleep, stay socially connected, and reach out to professionals if you feel overwhelmed.'
  }
];

// GET /api/public/health-info
router.get('/health-info', (req, res) => res.json(healthInfo));

module.exports = router;
