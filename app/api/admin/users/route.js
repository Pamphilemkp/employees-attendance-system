import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/dbConnect';
import Attendance from '../../../../models/Attendance';

export async function GET(request) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month');
  const employeeId = searchParams.get('employeeId');

  const query = {};

  if (month) {
    const startOfMonth = new Date(`${month}-01`);
    const endOfMonth = new Date(`${month}-01`);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);

    query.checkIn = { $gte: startOfMonth, $lt: endOfMonth };
  }

  if (employeeId) {
    query.employeeId = employeeId;
  }

  const attendances = await Attendance.find(query).sort({ employeeId: 1 });

  return NextResponse.json(attendances);
}
