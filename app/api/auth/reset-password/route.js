/* eslint-disable */
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { dbConnect } from '../../../../lib/dbConnect';
import User from '../../../../models/User';

export async function POST(request) {
  const { password, token } = await request.json();
  await dbConnect();

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return NextResponse.json({ success: false, message: 'Token is invalid or has expired' });
  }

  user.password = await bcrypt.hash(password, 12);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  return NextResponse.json({ success: true, message: 'Password has been reset successfully!' });
}
