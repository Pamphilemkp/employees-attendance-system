// models/Attendance.js
import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date },
});

const Attendance = mongoose.models.Attendance || mongoose.model('Attendance', AttendanceSchema);

export default Attendance;
