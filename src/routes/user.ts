import express from "express";
import { newUser, searchUser } from "../controllers/user";
import { isAuthenticated } from "../middlewares/auth";

const userRoter = express.Router();

userRoter.post("/new", newUser);

userRoter.put("/update", isAuthenticated);
userRoter.delete("/delete", isAuthenticated);
userRoter.get("/", searchUser, isAuthenticated);

export default userRoter;
