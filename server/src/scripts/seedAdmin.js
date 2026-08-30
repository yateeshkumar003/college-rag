const mongoose = require('mongoose');
const env = require('../config/env');
const User = require('../models/User');

const seedAdmin = async () => {
  try {
    console.log('[SEED] Connecting to MongoDB...');
    await mongoose.connect(env.MONGODB_URI);
    console.log('[SEED] MongoDB Connected. Checking Admin user...');

    const adminEmail = 'admin@college.edu';
    const adminExists = await User.findOne({ email: adminEmail });

    if (adminExists) {
      if (adminExists.role !== 'admin') {
        adminExists.role = 'admin';
        await adminExists.save();
        console.log(`[SEED] Updated existing user ${adminEmail} to have "admin" role.`);
      } else {
        console.log(`[SEED] Admin user already exists with email: ${adminEmail}`);
      }
      process.exit(0);
    }

    // Create the admin user
    await User.create({
      name: 'System Admin',
      email: adminEmail,
      password: 'adminpassword123', // Will be hashed automatically by pre-save hook
      role: 'admin',
    });

    console.log(`[SEED] Success! Admin account created successfully.`);
    console.log(`[SEED] Email: ${adminEmail}`);
    console.log(`[SEED] Password: adminpassword123`);
    process.exit(0);
  } catch (error) {
    console.error(`[SEED ERROR] Failed to seed database: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
