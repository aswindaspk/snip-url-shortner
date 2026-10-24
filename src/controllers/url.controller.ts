import type { NextFunction, Request, Response } from "express";
import { createUrlService, deleteUrlService, getUserUrlsService, updateUrlService } from "../services/url.service.js";
import { AppError } from "../error/AppError.js";
interface UrlInput {
    longUrl: string;
    alias?: string;
    user?: any; // Assuming user object is attached by the middleware
}

export async function createUrlController (req: Request, res: Response, next: NextFunction) {
    const {longUrl, alias}: UrlInput = req.body
    const user = req.user; // Assuming user object is attached by the middleware
    if (!longUrl) {
        throw new AppError("Long URL is required", 400);
    }
    if (user) {
        const userId = user.id;
        await getUserUrlsService(userId); // Ensure user exists
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
    const userId = req.user?.id
}

export async function deleteUrlController(req: Request, res: Response, next: NextFunction) {
    const {shortUrl} = req.body
    const userId = req.user?.id
    if (shortUrl && userId) {
        const deletedUrl = await deleteUrlService(shortUrl, userId)
        if (deletedUrl) {
            return res.status(200).json({
                message: "URL deleted successfully"
            })
        }
    }
}

export async function updateUrlController(req: Request, res: Response, next: NextFunction) {
    const {shortUrl, newLongUrl, alias, aliasChanged, urlChanged} = req.body
    const userId = req.user?.id
    if (shortUrl && userId) {
        const updatedUrl = await updateUrlService(shortUrl, userId, aliasChanged, urlChanged, newLongUrl, alias)
        return res.status(200).json({
            message: "URL updated successfully"
        })
    }
}

export async function getUserUrlsDetailsController(req: Request, res: Response, next: NextFunction) {
    const userId = req.user?.id
    const {page, limit} = req.query
    if (userId) {
        const userData = await getUserUrlsService(userId, page as string, limit as string)
        return res.status(200).json({
            userData
        })
    }
}