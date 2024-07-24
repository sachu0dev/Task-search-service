import { createClient, RedisClientType } from "redis";
import crypto from "crypto";

const redisClient: RedisClientType = createClient({
  socket: {
    host: "localhost",
    port: 6379,
  },
  password: "PASSWORD",
});

redisClient.on("error", (err: Error) => {
  console.log("Redis Client Error", err);
});

redisClient.on("connect", () => {
  console.log("Redis Client Connected");
});

redisClient.connect().catch(console.error);

export default redisClient;
