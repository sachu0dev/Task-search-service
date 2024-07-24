import mongoose from "mongoose";
import redisClient from "../redis/redis";
import { Response } from "express";
import jwt from "jsonwebtoken";

interface User {
  username: string;
}

const cookieOptions = {
  maxAge: 15 * 24 * 60 * 60 * 1000,
  sameSite: "none" as const,
  httpOnly: true,
  secure: true,
};

const clearRedisCache = async (): Promise<void> => {
  try {
    await redisClient.flushAll();
    console.log("Data flushed from Redis");
  } catch (err) {
    console.error("Error flushing data from Redis:", err);
  }
};

const connectDB = async (url: string): Promise<void> => {
  try {
    await mongoose.connect(url);
    console.log("Database connected successfully");

    const collectionName = "users";
    const changeStream = mongoose.connection.collection(collectionName).watch();

    changeStream.on("change", async (change) => {
      console.log("Change detected:", change);
      await clearRedisCache();
    });
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

const sendToken = (
  res: Response,
  user: User,
  statusCode: number,
  message: string
): Response => {
  const token = jwt.sign(
    { username: user.username },
    process.env.JWT_SECRET as string
  );
  console.log("Authenticated: " + user.username + " mode: Token");

  return res.status(statusCode).cookie("token", token, cookieOptions).json({
    success: true,
    message,
  });
};

export { connectDB, sendToken, clearRedisCache };
