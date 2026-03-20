/**
 * Admin Seed Script
 * Creates an admin user in the database for initial access.
 *
 * Usage: node backend/seedAdmin.js
 *
 * Default admin credentials:
 *   Email:    admin@learnhub.com
 *   Password: admin123
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const ADMIN_DATA = {
  name: 'Admin User',
  email: 'admin@learnhub.com',
  password: 'admin123',
  role: 'admin',
};

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existing = await User.findOne({ email: ADMIN_DATA.email });
    if (existing) {
      console.log('⚠️  Admin user already exists:');
      console.log(`   Email:    ${existing.email}`);
      console.log(`   Role:     ${existing.role}`);
      console.log('   No changes made.');
    } else {
      // Create admin (password will be hashed by the pre-save hook)
      const admin = await User.create(ADMIN_DATA);
      console.log('✅ Admin user created successfully!');
      console.log('─────────────────────────────────');
      console.log(`   Name:     ${admin.name}`);
      console.log(`   Email:    ${admin.email}`);
      console.log(`   Password: admin123`);
      console.log(`   Role:     ${admin.role}`);
      console.log('─────────────────────────────────');
      console.log('🔑 Use these credentials to log in as admin.');
    }
  } catch (error) {
    console.error('❌ Error seeding admin:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
};

seedAdmin();
