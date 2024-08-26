import bcrypt from 'bcryptjs';
import User from '@/models/User';

export async function seedDatabase() {
  const adminExists = await User.findOne({ role: 'admin' });

  if (!adminExists) {
    const users = [
      {
        name: 'Admin User',
        email: 'admin@ataner.com',
        password: bcrypt.hashSync('adminpassword', 10),
        role: 'admin',
      },
      {
        name: 'John Doe',
        email: 'john@ataner.com',
        password: bcrypt.hashSync('password123', 10),
        role: 'user',
      },
      {
        name: 'Jane Smith',
        email: 'jane@ataner.com',
        password: bcrypt.hashSync('password123', 10),
        role: 'user',
      },
      {
        name: 'Bob Johnson',
        email: 'bob@ataner.com',
        password: bcrypt.hashSync('password123', 10),
        role: 'user',
      },
    ];

    await User.insertMany(users);
    console.log('Database seeded successfully');
  } else {
    console.log('Admin user already exists, skipping seed.');
  }
}
