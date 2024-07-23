import express from "express";
import { newUser, searchUser } from "../controllers/user";
import { isAuthenticated } from "../middlewares/auth";

const userRoter = express.Router();

userRoter.post("/new", newUser);

userRoter.use(isAuthenticated);
userRoter.get("/", searchUser);

export default userRoter;
