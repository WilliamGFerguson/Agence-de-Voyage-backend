export interface ErrorData extends Error {
    status?: number
    code?: string
}