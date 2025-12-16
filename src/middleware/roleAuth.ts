import { NextFunction, Request, Response } from "express";
import JwtUser from "../types/JwtUser";
import createError from "../utils/createError";

export const roleAuth = (req: Request, _: Response, next: NextFunction) => {
  const user = (req as any).user as JwtUser;

  if (!user || user.role !== 'admin' || user.role !== 'admin') {
    return next(createError("Unauthorized", 401, "UNAUTHORIZED"))
  }
  next()
}