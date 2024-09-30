/* eslint-disable */
import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/dbConnect';
import Attendance from '../../../../models/Attendance';

export async function POST(request) {
  const { employeeId } = await request.json();
  await dbConnect();

  try {
    // Check if the employee is already checked in
    const existingAttendance = await Attendance.findOne({ employeeId, status: 'CheckedIn' });

    if (existingAttendance) {
      // Check-out the employee
      existingAttendance.checkOut = new Date();
      existingAttendance.status = 'CheckedOut';
      await existingAttendance.save();

      return NextResponse.json({ success: true, message: 'Checked out successfully.' });
    }
    // Check-in the employee
    const newAttendance = new Attendance({
      employeeId,
      checkIn: new Date(),
      status: 'CheckedIn',
    });
    await newAttendance.save();

    return NextResponse.json({ success: true, message: 'Checked in successfully.' });
  } catch (error) {
    console.error('Error checking in/out employee:', error);
    return NextResponse.json({ success: false, message: 'Failed to process attendance.' });
  }
}
