/* eslint-disable */
import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/dbConnect';
import Attendance from '../../../../models/Attendance';

export async function POST(request) {
  const { employeeId } = await request.json();
  await dbConnect();

  // Get the current date (Cyprus timezone adjustment can be done here if needed)
  const currentDate = new Date().toISOString().split('T')[0]; // Current day in 'YYYY-MM-DD'

  // Check if the employee already has a record for today (no duplicate check-ins for the same day)
  const existingAttendance = await Attendance.findOne({
    employeeId,
    checkIn: {
      $gte: new Date(`${currentDate}T00:00:00.000Z`), // Check if the check-in is today
      $lt: new Date(`${currentDate}T23:59:59.999Z`),  // Up to the end of today
    },
  });

  if (existingAttendance) {
    return NextResponse.json({
      success: false,
      message: 'You have already checked in today. No duplicate records allowed.',
    });
  }

  // Create a new attendance record for today
  const newAttendance = new Attendance({
    employeeId,
    checkIn: new Date(), // Record the check-in time
    status: 'CheckedIn',
  });

  await newAttendance.save();
  return NextResponse.json({ success: true, message: 'Checked in successfully.' });
}
