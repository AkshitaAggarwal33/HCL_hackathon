// backend/models/HealthInfo.js
const mongoose = require('mongoose');

const healthInfoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    text: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('HealthInfo', healthInfoSchema);
