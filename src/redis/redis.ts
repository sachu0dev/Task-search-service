import { createClient, RedisClientType } from "redis";

const redisClient: RedisClientType = createClient({
  socket: {
    host: "redis-server",
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
