/* eslint-disable */
import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/dbConnect';
import Attendance from '../../../../models/Attendance';

export async function POST(request) {
  const { employeeId } = await request.json();
  await dbConnect();

  // Get the current date
  const currentDate = new Date().toISOString().split('T')[0];

  // Find the employee's active attendance record for today
  const attendance = await Attendance.findOne({
    employeeId,
    checkIn: {
      $gte: new Date(`${currentDate}T00:00:00.000Z`),
      $lt: new Date(`${currentDate}T23:59:59.999Z`),
    },
    status: 'CheckedIn', // Only update if the status is still "CheckedIn"
  });

  if (!attendance) {
    return NextResponse.json({
      success: false,
      message: 'No active check-in found for today.',
    });
  }

  // Mark check-out time
  attendance.checkOut = new Date();
  attendance.status = 'CheckedOut';

  await attendance.save();
  return NextResponse.json({ success: true, message: 'Checked out successfully.' });
}
