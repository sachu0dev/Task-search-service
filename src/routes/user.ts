import express from "express";
import { newUser } from "../controllers/user";
import { searchUser } from "../controllers/search";
import { isAuthenticated } from "../middlewares/auth";

const userRoter = express.Router();

userRoter.post("/", newUser);  
userRoter.use(isAuthenticated);
userRoter.put("/", newUser);    
userRoter.delete("/", newUser); 
userRoter.get("/", searchUser);

export default userRoter;
