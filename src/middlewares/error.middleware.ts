import type { NextFunction, Request, Response } from "express";
import { AppError } from "../error/AppError.js";
import { env } from "../config/env.js";

export function errorMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
    if (res.headersSent) {
        return next(err);
    }
    if (env.NODE_ENV === 'prod') {
        if (err instanceof AppError && err.statusCode) {
        return res.status(err.statusCode).json({
            message: err.message,
            status: err.status
        });
    }
    res.status(500).json({
            message: "Internal Server Error",
            status: "error"
        });
    }
    else if (env.NODE_ENV === 'dev') {
        if (err instanceof AppError) {
            return res.status(err.statusCode).json({
                message: err.message,
                status: err.status,
                stack: err.stack,
                error: err
            });
        }
        res.status(500).json({
            message: err.message,
            status: "error",
            stack: err.stack
        });
    }
}