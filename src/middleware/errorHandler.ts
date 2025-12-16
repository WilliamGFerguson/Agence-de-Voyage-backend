import { NextFunction, Request, Response } from "express"
import { ErrorData } from "../types/Error"

export default function errorHandler (err: ErrorData, _req: Request, res: Response, _next: NextFunction) {
    const { message, status, code } = err
    
    res.status(status || 500).json({ message, status, code })
}