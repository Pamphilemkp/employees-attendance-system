import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../../lib/dbConnect';
import User from '../../../../../models/User';
import bcrypt from 'bcryptjs';

export async function PUT(request, { params }) {
  await dbConnect();
  const { id } = params;
  const { name, email, employeeId, role, password } = await request.json();

  const user = await User.findById(id);
  if (!user) {
    return NextResponse.json({ success: false, message: 'User not found' });
  }

  user.name = name || user.name;
  user.email = email || user.email;
  user.employeeId = employeeId || user.employeeId;
  user.role = role || user.role;
  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  await user.save();

  return NextResponse.json({ success: true, message: 'User updated successfully', user });
}

export async function DELETE(request, { params }) {
  await dbConnect();
  const { id } = params;

  const user = await User.findByIdAndDelete(id);
  if (!user) {
    return NextResponse.json({ success: false, message: 'User not found' });
  }

  return NextResponse.json({ success: true, message: 'User deleted successfully' });
}
