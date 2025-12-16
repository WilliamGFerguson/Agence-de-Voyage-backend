import { NextFunction, Request, Response } from "express";
import JwtUser from "../types/JwtUser";
import jwt from "jsonwebtoken";
import createError from "../utils/createError";

export const jwtAuth = (req: Request, _: Response, next: NextFunction) => {
    try {
      const token = req.cookies?.token;
      
      if (!token) {
        return next(createError("Invalid token", 401, "INVALID_TOKEN"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!);      

      (req as any).user = decoded as JwtUser;
      next();
    } catch (err) {
      return next(createError("Invalid token", 401, "INVALID_TOKEN"));
    }
}