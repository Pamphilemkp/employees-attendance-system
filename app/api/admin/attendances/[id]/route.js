/* eslint-disable */
import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../../lib/dbConnect';
import Attendance from '../../../../../models/Attendance';

// PUT (Update Attendance)
export async function PUT(request, { params }) {
  await dbConnect();
  const { id } = params;

  try {
    const { checkIn, checkOut } = await request.json();

    // Find attendance record by ID
    const attendance = await Attendance.findById(id);
    if (!attendance) {
      return NextResponse.json({ success: false, message: 'Attendance record not found' }, { status: 404 });
    }

    // Validate the input data (optional but recommended)
    if (checkIn && isNaN(Date.parse(checkIn))) {
      return NextResponse.json({ success: false, message: 'Invalid check-in date' }, { status: 400 });
    }
    if (checkOut && isNaN(Date.parse(checkOut))) {
      return NextResponse.json({ success: false, message: 'Invalid check-out date' }, { status: 400 });
    }

    // Update attendance record
    attendance.checkIn = checkIn || attendance.checkIn;
    attendance.checkOut = checkOut || attendance.checkOut;
    await attendance.save();

    return NextResponse.json({ success: true, message: 'Attendance updated successfully', attendance });
  } catch (error) {
    console.error('Error updating attendance:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

// DELETE (Delete Attendance)
export async function DELETE(request, { params }) {
  await dbConnect();
  const { id } = params;

  try {
    // Find and delete attendance record
    const attendance = await Attendance.findByIdAndDelete(id);
    if (!attendance) {
      return NextResponse.json({ success: false, message: 'Attendance record not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Attendance deleted successfully' });
  } catch (error) {
    console.error('Error deleting attendance:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
