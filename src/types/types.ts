import { Document } from "mongoose";
import {Request} from "express"

interface IUser extends Document {
  name: string;
  username: string;
  password?: string;
}


interface newRequest extends Request{
   user:IUser
}

interface JwtPayload {
  _id: string;
}

export { IUser, JwtPayload , newRequest};
