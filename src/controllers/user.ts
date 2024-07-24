import { TryCatch } from "../middlewares/error";

const newUser = TryCatch(async (req, res, next) => {
  res.json({ message: "user create route" });
});

export { newUser };
