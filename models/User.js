// // backend/middleware/authMiddleware.js
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// const auth = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization || '';
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({ message: 'No token provided' });
//     }

//     const token = authHeader.split(' ')[1];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     if (!decoded?.id) return res.status(401).json({ message: 'Token invalid' });

//     const user = await User.findById(decoded.id).select('-password');
//     if (!user) return res.status(401).json({ message: 'User not found' });

//     req.user = user;
//     next();
//   } catch (err) {
//     console.error('Auth middleware error:', err.message || err);
//     return res.status(401).json({ message: 'Invalid or expired token' });
//   }
// };

// const authorizeRoles = (...roles) => (req, res, next) => {
//   if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
//   if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden: insufficient role' });
//   next();
// };

// module.exports = { auth, authorizeRoles };


// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },

    role: {
      type: String,
      enum: ['patient', 'provider'],
      required: true
    },

    allergies: { type: String, default: '' },
    medications: { type: String, default: '' },

    consent: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// This exports a REAL Mongoose model
module.exports = mongoose.model('User', userSchema);
