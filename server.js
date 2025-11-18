// backend/server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const connectDB = require('./config/db');

// Route imports (filenames must match exactly)
const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patient');
const providerRoutes = require('./routes/provider');
const publicRoutes = require('./routes/public');

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());
app.use(morgan('dev'));

// Connect to DB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/provider', providerRoutes);
app.use('/api/public', publicRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  const status = err.statusCode || 500;
  res.status(status).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
