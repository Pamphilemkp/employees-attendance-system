/* eslint-disable */
import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/dbConnect';
import Attendance from '../../../../models/Attendance';

export async function POST(request) {
  const { employeeId } = await request.json();
  await dbConnect();

  // Find the employee's attendance record for today
  const attendance = await Attendance.findOne({ employeeId, status: 'CheckedIn' });
  if (!attendance) {
    return NextResponse.json({ success: false, message: 'No active check-in found.' });
  }

  attendance.checkOut = new Date();
  attendance.status = 'CheckedOut';

  await attendance.save();
  return NextResponse.json({ success: true, message: 'Checked out successfully.' });
}
