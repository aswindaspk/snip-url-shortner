import type { NextFunction, Request, Response } from "express";
import { auth } from "../utils/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { AppError } from "../error/AppError.js";

export async function optionalAuth(req: Request, res: Response, next: NextFunction) {
        // Check if the user is authenticated
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        })
    if (!session) {
        console.log("User is not authenticated");
        return next()
    }
    req.user = session?.user;
    console.log(req.user?.id,"::User")
    next();
}