const mongoose = require('mongoose');

async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);

    // Migrate old passwordStrength values to new categories
    const VaultEntry = require('../models/VaultEntry');
    await VaultEntry.updateMany({ passwordStrength: 'Impenetrable' }, { passwordStrength: 'Strong' });
    await VaultEntry.updateMany({ passwordStrength: 'Fair' }, { passwordStrength: 'Medium' });
    console.log('Database password strength levels migration completed.');
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
}

module.exports = connectDB;