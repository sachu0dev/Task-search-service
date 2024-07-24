import { Document } from "mongoose";

interface IUser extends Document {
  name: string;
  username: string;
  password?: string;
}

interface JwtPayload {
  _id: string;
}

export { IUser, JwtPayload };
