import { hash } from "bcrypt-ts";
import mongoose, { HookNextFunction, Schema, model } from "mongoose";
import { IUser } from "../types/types";

// Define the user schema
const userSchema: Schema<IUser> = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Middleware to hash the password before saving
userSchema.pre<IUser>("save", async function (next: HookNextFunction) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

// Export the User model
export const User = mongoose.models.User || model<IUser>("User", userSchema);
