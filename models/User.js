import mongoose, { Schema, models } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensure email is unique
    },
    password: {
      type: String,
      required: true,
    },
    employeeId: {
      type: String,
      required: true,
      unique: true, // Ensure employee ID is unique
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const User = models.User || mongoose.model("User", userSchema);
export default User;
