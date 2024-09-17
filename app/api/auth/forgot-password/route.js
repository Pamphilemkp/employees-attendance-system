import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/dbConnect';
import User from '../../../../models/User';
import crypto from 'crypto';
import { sendResetPasswordEmail } from '../../../../lib/email';

export async function POST(request) {
  const { email } = await request.json();
  await dbConnect();

  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json({ success: true, message: 'If an account with that email exists, a password reset link has been sent.' });
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // Token expires in 10 minutes

  await user.save({ validateBeforeSave: false });

  const resetURL = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password?token=${resetToken}`;

  try {
    await sendResetPasswordEmail(user.email, resetURL);
    return NextResponse.json({ success: true, message: 'Password reset link sent!' });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return NextResponse.json({ success: false, message: 'There was an error sending the email. Try again later.' });
  }
}
