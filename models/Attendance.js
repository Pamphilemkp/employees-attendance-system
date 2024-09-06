import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date },
  shortBreakIn: { type: Date }, // Short Break-In
  shortBreakOut: { type: Date }, // Short Break-Out
  duration: { type: Number, default: 0 }, // Duration in hours
  status: { type: String, enum: ['CheckedIn', 'CheckedOut'], default: 'CheckedIn' },
}, { timestamps: true });

// Calculate total duration while considering breaks
AttendanceSchema.pre('save', function (next) {
  if (this.checkOut && this.checkIn) {
    const totalWorkingTime = (new Date(this.checkOut) - new Date(this.checkIn)) / (1000 * 60 * 60); // total time
    if (this.shortBreakIn && this.shortBreakOut) {
      const breakTime = (new Date(this.shortBreakOut) - new Date(this.shortBreakIn)) / (1000 * 60 * 60); // break time
      this.duration = totalWorkingTime - breakTime; // deduct the break time from total working time
    } else {
      this.duration = totalWorkingTime;
    }
  }
  next();
});

const Attendance = mongoose.models.Attendance || mongoose.model('Attendance', AttendanceSchema);
export default Attendance;
