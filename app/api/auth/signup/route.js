/* eslint-disable */
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { dbConnect } from '../../../../lib/dbConnect';
import UserModel from '../../../../models/User';

export const POST = async (request) => {
  try {
    const {
      name, email, password, employeeId, role = 'employee',
    } = await request.json();

    if (!name || !email || !password || !employeeId) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 },
      );
    }

    await dbConnect();

    // Check if the email or employeeId already exists
    const existingUser = await UserModel.findOne({ email });
    const existingEmployeeId = await UserModel.findOne({ employeeId });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Email already exists' },
        { status: 400 },
      );
    }

    if (existingEmployeeId) {
      return NextResponse.json(
        { message: 'Employee ID already exists' },
        { status: 400 },
      );
    }

    // Log the original password received from the request
    console.log('Original Password:', password);

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Log the hashed password
    console.log('Hashed Password:', hashedPassword);

    // Create the new user with the hashed password
    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      employeeId,
      role,
    });

    // Log the stored user details
    console.log('Stored User:', newUser);

    return NextResponse.json(
      { message: 'User registered successfully', userId: newUser._id },
      { status: 201 },
    );
  } catch (err) {
    console.error('Error during signup:', err);
    return NextResponse.json(
      { message: 'An error occurred while registering the user.' },
      { status: 500 },
    );
  }
};
