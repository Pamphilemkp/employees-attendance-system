import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/dbConnect';
import Attendance from '../../../../models/Attendance';

export async function GET(request) {
  await dbConnect();
  
  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month');
  const userId = searchParams.get('userId');
  
  const query = {};

  if (month) {
    const startOfMonth = new Date(`${month}-01`);
    const endOfMonth = new Date(`${month}-01`);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);

    query.checkIn = { $gte: startOfMonth, $lt: endOfMonth };
  }

  if (userId) {
    query.employeeId = userId;
  }

  const attendances = await Attendance.find(query);

  return NextResponse.json(attendances);
}
