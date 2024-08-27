import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongoose';
import Attendance from '../../../../models/Attendance';

export async function POST(request) {
  const { employeeId } = await request.json();
  await dbConnect();

  const attendance = new Attendance({
    employeeId,
    checkIn: new Date(), // Current date and time
  });

  await attendance.save();
  return NextResponse.json({ success: true, message: 'Check-in successful!' });
}
