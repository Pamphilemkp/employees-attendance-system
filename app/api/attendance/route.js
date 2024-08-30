import { NextResponse } from 'next/server';
import { dbConnect } from '../../../lib/dbConnect';
import Attendance from '../../../models/Attendance';

export async function GET() {
  await dbConnect();

  try {
    const attendances = await Attendance.find({});
    return NextResponse.json(attendances);
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Error fetching attendances.' }, { status: 500 });
  }
}
