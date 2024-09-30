/* eslint-disable */
import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/dbConnect';
import Attendance from '../../../../models/Attendance';

export async function POST(request) {
  await dbConnect();

  const {
    id, checkIn, checkOut, shortBreakIn, shortBreakOut,
  } = await request.json();

  try {
    const attendance = await Attendance.findById(id);
    if (!attendance) {
      return NextResponse.json({ success: false, message: 'Attendance record not found.' });
    }

    attendance.checkIn = checkIn || attendance.checkIn;
    attendance.checkOut = checkOut || attendance.checkOut;
    attendance.shortBreakIn = shortBreakIn || attendance.shortBreakIn;
    attendance.shortBreakOut = shortBreakOut || attendance.shortBreakOut;

    await attendance.save();
    return NextResponse.json({ success: true, message: 'Attendance updated successfully!' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Error updating attendance.', error });
  }
}
