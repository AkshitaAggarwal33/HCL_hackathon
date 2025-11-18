// backend/models/Goal.js
const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    steps: { type: Number, default: 0 },
    water: { type: Number, default: 0 }, // glasses
    sleep: { type: Number, default: 0 }, // hours
    activeMinutes: { type: Number, default: 0 },
    date: { type: String, required: true } // YYYY-MM-DD
  },
  { timestamps: true }
);

goalSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Goal', goalSchema);
