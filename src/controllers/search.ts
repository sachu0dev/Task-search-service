import { NextFunction, Request, Response } from "express";
import { QueryParams, searchUserSchema } from "../lib/validators";
import { TryCatch } from "../middlewares/error";
import { User } from "../models/user";
import { IUser } from "../types/types";
import { ErrorHandler } from "../utils/utility";
import redisClient from "../redis/redis"; // Adjust the import if necessary
import crypto from "crypto";
import { RedisClientType } from "redis";

type UserSearchResult = Pick<IUser, "name" | "username" | "_id">;

const generateCacheKey = (query: string, page: string) => {
  const keyString = `search:${query}:${page}`;
  return crypto.createHash("sha256").update(keyString).digest("hex");
};
const getResults = async (
  query: string,
  page: string,
  redisClient: RedisClientType
): Promise<UserSearchResult[] | null> => {
  const cacheKey = generateCacheKey(query, page);

  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log("Data retrieved from Redis cache:", JSON.parse(cachedData));
      redisClient.expire(cacheKey, 300);
      return JSON.parse(cachedData) as UserSearchResult[];
    }
    return null;
  } catch (err) {
    console.error("Error retrieving data from Redis:", err);
    return null;
  }
};

interface SearchResponse {
  success: boolean;
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  users: UserSearchResult[];
}

const searchUser = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const queryParams = QueryParams.parse(req.query);
    const { q: query, page } = queryParams;
    const limit = 10;

    const parseResult = searchUserSchema.safeParse({
      query,
      page: Number(page),
    });

    if (!parseResult.success) {
      return next(new ErrorHandler("Invalid query or page", 400));
    }

    const searchPattern = new RegExp(query.split("").join(".*"), "i");

    const cachedUsers = await getResults(query, page, redisClient);
    if (cachedUsers) {
      const response: SearchResponse = {
        success: true,
        currentPage: Number(page),
        totalPages: Math.ceil(cachedUsers.length / limit),
        totalUsers: cachedUsers.length,
        users: cachedUsers,
      };

      return res.json(response);
    } else {
      const totalUsers = await User.countDocuments({
        $or: [
          { name: { $regex: searchPattern } },
          { username: { $regex: searchPattern } },
        ],
      });

      const totalPages = Math.ceil(totalUsers / limit);
      const skip = (Number(page) - 1) * limit;

      const users = await User.find({
        $or: [
          { name: { $regex: searchPattern } },
          { username: { $regex: searchPattern } },
        ],
      })
        .select("name username -_id")
        .skip(skip)
        .limit(limit)
        .lean();

      if (users.length === 0) {
        return next(new ErrorHandler("No users found matching the query", 404));
      }

      console.log("Data retrieved from MongoDB:", users);

      const typedUsers = users as UserSearchResult[];

      const cacheKey = generateCacheKey(query, page);
      await redisClient.setEx(cacheKey, 300, JSON.stringify(typedUsers));

      const response: SearchResponse = {
        success: true,
        currentPage: Number(page),
        totalPages,
        totalUsers,
        users: typedUsers,
      };
      return res.json(response);
    }
  }
);

export { searchUser };
