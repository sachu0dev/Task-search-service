import { TryCatch } from "../middlewares/error";

const newUser = TryCatch(async (req, res, next) => {
  res.json({ message: "user create route" });
});

const searchUser = TryCatch(async (req, res, next) => {
  const query = req.query.q as string;
  res.send(`Searching for user: ${query}`);
});



const u

export { newUser, searchUser };
