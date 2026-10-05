import type { NextFunction, Request, Response } from "express";
import { createUrlService } from "../services/url.service.js";
import { AppError } from "../error/AppError.js";
interface UrlInput {
    longUrl: string;
    alias?: string;
    user?: any; // Assuming user object is attached by the middleware
}

export async function createUrlController (req: Request, res: Response, next: NextFunction) {
    const {longUrl, alias, user}: UrlInput = req.body
    if (!longUrl) {
        throw new AppError("Long URL is required", 400);
    }
    if (user) {
        const userId = user.id;
        const shortUrl = await createUrlService(longUrl, alias, userId);
        return res.status(201).json({
            shortUrl
        })
    }
    const shortUrl = await createUrlService(longUrl, alias);
    return res.status(201).json({
        shortUrl
    })
}

export async function getUrlDetailsController(req: Request, res: Response, next: NextFunction) {
    const {shortUrl} = req.body
}

export async function deleteUrlController(req: Request, res: Response, next: NextFunction) {

}

export async function updateUrlController(req: Request, res: Response, next: NextFunction) {
    
}