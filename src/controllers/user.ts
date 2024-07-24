import { TryCatch } from "../middlewares/error";
import { ErrorHandler } from "../utils/utility";

const newUser = TryCatch(async (req, res, next) => {
  return next(new ErrorHandler("user create route", 400));
  res.json({ message: "user create route" });
});

export { newUser };
