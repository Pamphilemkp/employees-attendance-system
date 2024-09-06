import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/dbConnect';
import Attendance from '../../../../models/Attendance';

export async function POST(request) {
  const { employeeId } = await request.json();
  await dbConnect();

  const attendance = await Attendance.findOne({ employeeId, status: 'CheckedIn' });
  if (!attendance) {
    return NextResponse.json({ success: false, message: 'No active check-in found.' });
  }

  attendance.shortBreakOut = new Date();
  await attendance.save();

  return NextResponse.json({ success: true, message: 'Short break ended successfully.' });
}
