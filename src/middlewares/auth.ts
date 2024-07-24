import { Request, Response, NextFunction } from "express";
import { ErrorHandler } from "../utils/utility";
import { TryCatch } from "./error";
import jwt from "jsonwebtoken"
import {User} from "../models/user"
import { IUser,newRequest ,JwtPayload} from "../types/types";

const isAuthenticated =(
  async (req: newRequest, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.jwt;
    if(!token){
      return next(new ErrorHandler("Unauthenticated", 401));
    }
    const decoded :any = jwt.verify(token , "SECRET");
    if(!decoded){
      return next(new ErrorHandler("Access  denied", 403));
    }
    const user= await User.findOne({username : decoded.username}).select("-password");
    req.user = user;
    next();

    } catch (error :any) {
      return (new ErrorHandler(error.message , 400))
    }
  }
)

export { isAuthenticated };





