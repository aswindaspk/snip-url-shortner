//custom error class for operational error
export class AppError extends Error {
    statusCode: number;
    status: string;
    isOperational: boolean;
    constructor(message: string, statusCode: number, status: string) {
        super(message);
        this.statusCode = statusCode;
        this.status = statusCode >= 400 && statusCode < 500 ? 'Operational Error' : 'Server Error';
        this.isOperational = true;
        // Maintains proper stack trace for where our error was thrown (only available on V8)
        Error.captureStackTrace(this, this.constructor);
    }
}