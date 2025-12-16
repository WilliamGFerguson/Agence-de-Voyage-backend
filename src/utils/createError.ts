import { ErrorData } from "../types/Error"

export default function createError(message: string, status: number, code: string): ErrorData {
    const err = new Error(message) as ErrorData
    err.status = !isNaN(status) ? status : 500
    err.code = code || "INTERNAL_SERVER_ERROR"
    return err
}