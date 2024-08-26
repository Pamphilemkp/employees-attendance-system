import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: String,
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();
  
  this.password = bcrypt.hashSync(this.password, 10); // Hash password before saving
  next();
});

export default mongoose.models.User || mongoose.model('User', userSchema);

