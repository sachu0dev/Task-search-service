import { Request, Response, NextFunction } from "express";
import { TryCatch } from "../middlewares/error";
import { User } from "../models/user";
import { UserSchema } from "../lib/validators";
import { ErrorHandler } from "../utils/utility";
import bcrypt from "bcrypt";

const newUser = TryCatch(async (req: Request, res: Response, next: NextFunction) => {
  const { method, body } = req;
  const { user } = req as any; // Casting to access user object in request

  // Handle user creation (POST request)
  if (method === "POST") {
    // Validate user data
    const parseResult = UserSchema.safeParse(body);
    if (!parseResult.success) {
      return next(new ErrorHandler(parseResult.error.errors[0].message, 400));
    }

    const { name, username, password } = parseResult.data;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return next(new ErrorHandler("User already exists", 400));
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      name,
      username,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        name: newUser.name,
        username: newUser.username,
      },
    });
  }

  // Handle user update (PUT request)
  if (method === "PUT") {
    if (!user) {
      return next(new ErrorHandler("User not authenticated", 401));
    }

    const { name, password } = body;

    // Prepare update data
    const updateData: any = {};
    if (name) updateData.name = name;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    // Update user in the database
    const updatedUser = await User.findByIdAndUpdate(user._id, updateData, { new: true }).select("-password");

    if (!updatedUser) {
      return next(new ErrorHandler("User not found", 404));
    }

    return res.json({
      success: true,
      message: "User updated successfully",
      user: {
        name: updatedUser.name,
        username: updatedUser.username,
      },
    });
  }

  // Handle user deletion (DELETE request)
  if (method === "DELETE") {
    if (!user) {
      return next(new ErrorHandler("User not authenticated", 401));
    }

    // Delete user from the database
    const deletedUser = await User.findByIdAndDelete(user._id);

    if (!deletedUser) {
      return next(new ErrorHandler("User not found", 404));
    }

    return res.json({
      success: true,
      message: "User deleted successfully",
    });
  }

  // Handle unsupported methods
  return next(new ErrorHandler("Method not allowed", 405));
});

export { newUser };
