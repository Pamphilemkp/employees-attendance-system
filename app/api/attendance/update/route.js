import { NextResponse } from 'next/server';
import {dbConnect} from '../../../../lib/dbConnect';
import Attendance from '../../../../models/Attendance';

export async function POST(request) {
  const { id, checkIn, checkOut } = await request.json();
  await dbConnect();

  const attendance = await Attendance.findById(id);
  if (!attendance) {
    return NextResponse.json({ success: false, message: 'Attendance record not found.' });
  }

  attendance.checkIn = checkIn;
  attendance.checkOut = checkOut;

  await attendance.save();
  return NextResponse.json({ success: true, message: 'Attendance updated successfully!' });
}
