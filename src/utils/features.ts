import mongoose from "mongoose";
import redisClient from "../redis/redis";

const connectDB = async (url: string) => {
  try {
    await mongoose.connect(url);
    console.log("Database connected successfully");

    // const collectionName = "users";
    // const changeStream = mongoose.connection.collection(collectionName).watch();

    // changeStream.on("change", async (change) => {
    //   console.log("Change detected:", change);
    //   await clearRedisCache();
    // });
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

const clearRedisCache = async () => {
  try {
    await redisClient.flushAll();
    console.log("Data flushed from Redis");
  } catch (err) {
    console.error("Error flushing data from Redis:", err);
  }
};

export { connectDB };
