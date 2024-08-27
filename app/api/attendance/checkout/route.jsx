import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongoose';
import Attendance from '../../../../models/Attendance';

export async function POST(request) {
  const { employeeId } = await request.json();
  await dbConnect();

  const attendance = await Attendance.findOne({ employeeId, checkOut: null });
  if (!attendance) {
    return NextResponse.json({ success: false, message: 'No active session found.' });
  }

  attendance.checkOut = new Date(); // Current date and time
  await attendance.save();

  return NextResponse.json({ success: true, message: 'Check-out successful!' });
}
