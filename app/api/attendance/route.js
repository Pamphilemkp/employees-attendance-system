/* eslint-disable */
// File: /app/api/attendance/route.js
import { NextResponse } from 'next/server'; // Import NextResponse
import { dbConnect } from '../../../lib/dbConnect';
import Attendance from '../../../models/Attendance';

export async function GET(request) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month');
  const employeeId = searchParams.get('employeeId');

  if (!employeeId) {
    return NextResponse.json({ error: 'Employee ID is required' }, { status: 400 });
  }

  try {
    const startOfMonth = new Date(`${month}-01`);
    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(startOfMonth.getMonth() + 1);

    // Fetch attendance records for the logged-in employeeId within the specified month
    const attendances = await Attendance.find({
      employeeId,
      checkIn: { $gte: startOfMonth, $lt: endOfMonth },
    });

    return NextResponse.json(attendances);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching attendance records' }, { status: 500 });
  }
}
