import express from "express";
import { deleteUser, getUser, newUser, updateUser } from "../controllers/user";
import { searchUser } from "../controllers/search";
import { isAuthenticated } from "../middlewares/auth";

const userRoter = express.Router();
userRoter.post("/new", newUser);
userRoter.use(isAuthenticated);
userRoter.route("/me").get(getUser).put(updateUser).delete(deleteUser);
userRoter.get("/", searchUser);
export default userRoter;
