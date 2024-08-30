import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/dbConnect';
import Attendance from '../../../../models/Attendance';

export async function GET() {
  await dbConnect();
  const attendances = await Attendance.find({});
  return NextResponse.json(attendances);
}
