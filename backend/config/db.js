const mongoose = require('mongoose');
const runMigration = require('../utils/migrate');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/paperbag';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
    
    // Run tenant database migrations
    await runMigration();
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // stop server if cannot connect
  }
};

module.exports = connectDB;
