import { NextFunction, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";
import { createClient } from "redis";
import { User } from "../models/user";
import { JwtPayload, newRequest } from "../types/types";
import { ErrorHandler } from "../utils/utility";
import redisClient from "../redis/redis";

const WINDOW_SIZE_IN_SECONDS = 60;
const MAX_REQUESTS_PER_WINDOW = 100;

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

    const key = `rate_limit:${user._id}`;
    const currentTime = Math.floor(Date.now() / 1000);
    const windowStart = currentTime - WINDOW_SIZE_IN_SECONDS;

    const result = await redisClient
      .multi()
      .zRemRangeByScore(key, 0, windowStart)
      .zCard(key)
      .zAdd(key, { score: currentTime, value: currentTime.toString() })
      .expire(key, WINDOW_SIZE_IN_SECONDS * 2)
      .exec();

    if (!result) {
      return next(new ErrorHandler("Rate limiting error", 500));
    }

    const requestCount = result[1] as number;

    if (requestCount > MAX_REQUESTS_PER_WINDOW) {
      return next(new ErrorHandler("Too many requests", 429));
    }

    req.user = user;
    next();
  } catch (error: any) {
    next(new ErrorHandler(error.message, 400));
  }
};

export { isAuthenticated };
