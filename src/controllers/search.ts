import { searchUserSchema } from "../lib/validators";
import { TryCatch } from "../middlewares/error";
import { User } from "../models/user";
import { ErrorHandler } from "../utils/utility";

const searchUser = TryCatch(async (req, res, next) => {
  const query = req.query.q as string;

  const parseResult = searchUserSchema.safeParse({ query });
  if (!parseResult.success) {
    return next(new ErrorHandler("Invalid query", 400));
  }

  const searchPattern = new RegExp(query.split("").join(".*"), "i");

  const users = await User.find({
    $or: [
      { name: { $regex: searchPattern } },
      { username: { $regex: searchPattern } },
    ],
  }).select("name username");

  if (users.length === 0) {
    return next(new ErrorHandler("No users found matching the query", 404));
  }

  res.json({
    success: true,
    count: users.length,
    users,
  });
});

export { searchUser };
