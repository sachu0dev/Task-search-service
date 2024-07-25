import { Request, Response, NextFunction, RequestHandler } from "express";
import { TryCatch } from "../middlewares/error";
import { User } from "../models/user";
import { updateUserSchema, UserSchema } from "../lib/validators";
import { ErrorHandler } from "../utils/utility";
import bcrypt from "bcrypt";
import { sendToken } from "../utils/features";
import { newRequest } from "../types/types";

const newUser = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { body } = req;
    const { user } = req as any;

    const parseResult = UserSchema.safeParse(body);
    if (!parseResult.success) {
      return next(new ErrorHandler(parseResult.error.errors[0].message, 400));
    }

    const { name, username, password } = parseResult.data;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return next(new ErrorHandler("User already exists", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      username,
      password: hashedPassword,
    });

    sendToken(res, newUser, 201, "User created successfully");
  }
);

const getUser = TryCatch(
  async (req: newRequest, res: Response, next: NextFunction) => {
    const { user } = req;
    const {id} = req.params;

    if (!user) {
      return next(new ErrorHandler("Unauthorised", 401));
    }
    const newUser = await User.findById(id).select("-password");
    if(!newUser){
      return next(new ErrorHandler("User not found", 404));
    }

    res.status(200).json({
      success: true,
      newUser,
    });
  }
);

const updateUser = TryCatch(
  async (req: newRequest, res: Response, next: NextFunction) => {
    const { body } = req;

    const { user } = req;

    if (!user) {
      return next(new ErrorHandler("Unauthorised", 401));
    }
    const parseResult = updateUserSchema.safeParse(body);
    if (!parseResult.success) {
      return next(new ErrorHandler(parseResult.error.errors[0].message, 400));
    }

    const { name, username , password } = parseResult.data;

    const getUser = await User.findOneAndUpdate(
      { _id: user._id },
      { name, username , password }
    ).select("-passwod");

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    res.status(200).json({
      success: true,
      getUser,
      message: "User updated successfully",
    });
  }
);

const deleteUser: RequestHandler = TryCatch(
  async (req: newRequest, res: Response, next: NextFunction) => {
    const { user } = req;

    if (!user) {
      return next(new ErrorHandler("Unauthorised", 401));
    }
    
    await User.findByIdAndDelete(user._id);
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  }
);

export { newUser, getUser, updateUser, deleteUser };
