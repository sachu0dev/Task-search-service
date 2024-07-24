import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { QueryParams, searchUserSchema } from "../lib/validators";
import { TryCatch } from "../middlewares/error";
import { User } from "../models/user";
import { ErrorHandler } from "../utils/utility";
import { IUser } from "../types/types";

type UserSearchResult = Pick<IUser, "name" | "username" | "_id">;

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

    const typedUsers = users as UserSearchResult[];

    const response: SearchResponse = {
      success: true,
      currentPage: Number(page),
      totalPages,
      totalUsers,
      users: typedUsers,
    };

    res.json(response);
  }
);

export { searchUser };
