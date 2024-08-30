import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import dbConnect from './lib/dbConnect.js';
import User from './models/User.js';

async function seedAdminUser() {
  await dbConnect();

  const adminUser = {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'Admin123!',
    employeeId: 'admin001',
    role: 'admin',
  };

  const existingUser = await User.findOne({ email: adminUser.email });

  if (!existingUser) {
    const newUser = new User(adminUser);
    await newUser.save();
    console.log('Admin user created:', newUser);
  } else {
    console.log('Admin user already exists:', existingUser);
  }

  process.exit();
}

seedAdminUser().catch((err) => {
  console.error('Error seeding admin user:', err);
  process.exit(1);
});
