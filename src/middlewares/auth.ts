import { Request, Response, NextFunction } from "express";
import { ErrorHandler } from "../utils/utility";
import { TryCatch } from "./error";

const isAuthenticated = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    return next(new ErrorHandler("Unauthenticated", 401));
  }
);

export { isAuthenticated };
