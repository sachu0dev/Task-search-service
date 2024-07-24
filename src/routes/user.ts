import express from "express";
import { newUser } from "../controllers/user";
import { searchUser } from "../controllers/search";
import { isAuthenticated } from "../middlewares/auth";

const userRoter = express.Router();
userRoter.post("/new", newUser);
userRoter.use(isAuthenticated);
userRoter.put("/update");
userRoter.delete("/delete");
userRoter.get("/", searchUser);
export default userRoter;
