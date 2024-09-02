import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date },
  duration: { type: Number, default: 0 }, // Duration in hours
  status: { type: String, enum: ['CheckedIn', 'CheckedOut'], default: 'CheckedIn' },
}, { timestamps: true });

AttendanceSchema.index({ employeeId: 1 });

// Validate that checkOut is after checkIn
AttendanceSchema.path('checkOut').validate(function (value) {
  if (value && this.checkIn) {
    return value > this.checkIn;
  }
  return true;
}, 'Check-Out date must be after Check-In date');

// Pre-save middleware to calculate duration if checkOut is set
AttendanceSchema.pre('save', function (next) {
  if (this.checkOut && this.checkIn) {
    const diff = (new Date(this.checkOut) - new Date(this.checkIn)) / (1000 * 60 * 60); // Calculate duration in hours
    this.duration = diff;
  }
  next();
});

const Attendance = mongoose.models.Attendance || mongoose.model('Attendance', AttendanceSchema);

export default Attendance;

