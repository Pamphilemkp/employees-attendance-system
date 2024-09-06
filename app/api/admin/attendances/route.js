import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/dbConnect';
import Attendance from '../../../../models/Attendance';

export async function GET(request) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month');
  const employeeId = searchParams.get('employeeId');

  const query = {};

  // Filter by month
  if (month) {
    const startOfMonth = new Date(`${month}-01`);
    const endOfMonth = new Date(`${month}-01`);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);

    query.checkIn = { $gte: startOfMonth, $lt: endOfMonth };
  }

  // Filter by employeeId if provided
  if (employeeId) {
    query.employeeId = employeeId; // Directly matching employeeId from Attendance
  }

  try {
    // Fetch attendance records with employeeId directly from Attendance collection
    const attendances = await Attendance.find(query).sort({ employeeId: 1 });

    console.log('Attendance Records:', attendances); // Debugging
    return NextResponse.json(attendances);
  } catch (error) {
    console.error('Error fetching attendance data:', error);
    return NextResponse.json({ error: 'Error fetching attendance data' }, { status: 500 });
  }
}

