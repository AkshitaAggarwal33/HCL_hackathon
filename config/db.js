// backend/config/db.js
require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MongoDB connection error: MONGO_URI is not defined in .env');
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      dbName: process.env.MONGO_DB_NAME || undefined,
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('MongoDB connection error:', err.message || err);
    process.exit(1);
  }
};

module.exports = connectDB;
