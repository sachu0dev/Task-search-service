import { Document } from "mongoose";

import { Request } from "express";
interface IUser extends Document {
  name: string;
  username: string;
  password?: string;
}



interface JwtPayload {
  _id: string;
}


interface newRequest extends Request{
  user:IUser;
}

export { IUser, JwtPayload  , newRequest };
