import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/dbConnect';
import User from '../../../../models/User';
import bcrypt from 'bcryptjs';
export async function GET() {
  await dbConnect();
  const users = await User.find({});
  return NextResponse.json(users);
}


export async function POST(request) {
  await dbConnect();
  const { name, email, employeeId, role, password } = await request.json();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ success: false, message: 'Email already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({ name, email, employeeId, role, password: hashedPassword });
  await user.save();

  return NextResponse.json({ success: true, message: 'User created successfully', user });
}
