import mongoose from 'mongoose';
import dbConnect from '../lib/mongoose';
import User from '../models/User';
import bcrypt from 'bcrypt';

const seedData = async () => {
  try {
    await dbConnect();
    console.log('Connected to MongoDB.');

    // Clear existing data
    await User.deleteMany();

    // Seed data
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('password123', saltRounds);

    const users = [
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: hashedPassword,
        employeeId: 'EMP001',
        role: 'admin',
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        password: hashedPassword,
        employeeId: 'EMP002',
        role: 'employee',
      },
    ];

    await User.insertMany(users);
    console.log('Data seeded successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedData();
