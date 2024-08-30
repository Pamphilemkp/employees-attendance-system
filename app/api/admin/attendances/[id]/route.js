import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../../lib/dbConnect';
import Attendance from '../../../../../models/Attendance';

export async function PUT(request, { params }) {
  await dbConnect();
  const { id } = params;
  const { checkIn, checkOut } = await request.json();

  const attendance = await Attendance.findById(id);
  if (!attendance) {
    return NextResponse.json({ success: false, message: 'Attendance record not found' });
  }

  attendance.checkIn = checkIn || attendance.checkIn;
  attendance.checkOut = checkOut || attendance.checkOut;

  await attendance.save();

  return NextResponse.json({ success: true, message: 'Attendance updated successfully', attendance });
}

export async function DELETE(request, { params }) {
  await dbConnect();
  const { id } = params;

  const attendance = await Attendance.findByIdAndDelete(id);
  if (!attendance) {
    return NextResponse.json({ success: false, message: 'Attendance record not found' });
  }

  return NextResponse.json({ success: true, message: 'Attendance deleted successfully' });
}
