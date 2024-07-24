import express from "express";
import { newUser } from "../controllers/user";
import { searchUser } from "../controllers/search";
import { isAuthenticated } from "../middlewares/auth";

const userRoter = express.Router();
userRoter.post("/new", newUser);

userRoter.put("/update", isAuthenticated);
userRoter.delete("/delete", isAuthenticated);
userRoter.get("/", searchUser, isAuthenticated);
export default userRoter;
