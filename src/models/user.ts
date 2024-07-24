import mongoose, { Schema, model, Document } from "mongoose";
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

export const User = mongoose.models.User || model<IUser>("User", userSchema);
