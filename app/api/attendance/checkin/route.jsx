import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/dbConnect';
import Attendance from '../../../../models/Attendance';

export async function POST(request) {
  const { employeeId } = await request.json();
  await dbConnect();

  // Check if the employee is already checked in
  const existingAttendance = await Attendance.findOne({ employeeId, status: 'CheckedIn' });
  if (existingAttendance) {
    return NextResponse.json({ success: false, message: 'You are already checked in.' });
  }

  const newAttendance = new Attendance({
    employeeId,
    checkIn: new Date(),
  });

  await newAttendance.save();
  return NextResponse.json({ success: true, message: 'Checked in successfully.' });
}
