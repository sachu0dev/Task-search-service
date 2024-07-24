import { Request, Response, NextFunction } from "express";
import { ErrorHandler } from "../utils/utility";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import { JwtPayload, newRequest } from "../types/types";
import { RequestHandler } from "express";

const isAuthenticated: RequestHandler = async (
  req: newRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return next(new ErrorHandler("Unauthenticated", 401));
    }
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    if (!decoded) {
      return next(new ErrorHandler("Access denied", 403));
    }

    const user = await User.findOne({ username: decoded.username }).select(
      "-password"
    );

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    req.user = user; // Set the user on the request object
    next();
  } catch (error: any) {
    next(new ErrorHandler(error.message, 400));
  }
};

export { isAuthenticated };
