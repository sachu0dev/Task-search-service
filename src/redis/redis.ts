import { createClient, RedisClientType } from 'redis';
import { config } from 'dotenv';

config(); // Load environment variables from .env file

const redisClient: RedisClientType = createClient({
  socket: {
    host: 'localhost',
    port: 6379,
  },
  password: process.env.REDIS_PASSWORD, // Use environment variable
});

redisClient.on('error', (err: Error) => {
  console.log('Redis Client Error', err);
});

redisClient.on('connect', () => {
  console.log('Redis Client Connected');
});

redisClient.connect().catch(console.error);

export default redisClient;
