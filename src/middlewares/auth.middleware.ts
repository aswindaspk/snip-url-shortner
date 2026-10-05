import type { NextFunction, Request, Response } from "express";
import { auth } from "../utils/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { AppError } from "../error/AppError.js";

export async function isAuthenticated(req: Request, res: Response, next: NextFunction) {
    // Check if the user is authenticated
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    })
    if (!session) {
        return next(new AppError("Unauthorized", 401));
    }

    req.user = session.user;
    next();
}