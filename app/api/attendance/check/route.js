/* eslint-disable */
import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/dbConnect';
import Attendance from '../../../../models/Attendance';

export async function POST(request) {
  const { employeeId } = await request.json();
  await dbConnect();

  try {
    // Get the current date at midnight to ensure only one check-in/check-out per day
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0); // Set to midnight

    // Find today's attendance record for the employee
    const existingAttendance = await Attendance.findOne({
      employeeId,
      checkIn: { $gte: todayStart }, // Only check records from today onwards
    });

    if (existingAttendance) {
      if (existingAttendance.status === 'CheckedIn' && !existingAttendance.checkOut) {
        // If the employee has already checked in today but not checked out, check them out
        existingAttendance.checkOut = new Date();
        existingAttendance.status = 'CheckedOut';
        await existingAttendance.save();

        return NextResponse.json({ success: true, message: 'Checked out successfully.' });
      } else {
        // If the employee has already checked out today, prevent further actions
        return NextResponse.json({ success: false, message: 'You have already checked in and out today.' });
      }
    }

    // If no existing attendance record for today, create a new check-in
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
