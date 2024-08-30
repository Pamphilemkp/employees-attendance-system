import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date },
  status: { type: String, enum: ['CheckedIn', 'CheckedOut'], default: 'CheckedIn' },
}, { timestamps: true });

AttendanceSchema.index({ employeeId: 1 });

AttendanceSchema.path('checkOut').validate(function(value) {
  if (value && this.checkIn) {
    return value > this.checkIn;
  }
  return true;
}, 'Check-Out date must be after Check-In date');

const Attendance = mongoose.models.Attendance || mongoose.model('Attendance', AttendanceSchema);

export default Attendance;
