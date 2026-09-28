import type { Request, Response } from "express";
import { createUrlService } from "../services/url.service.js";
import { AppError } from "../error/AppError.js";
interface UrlInput {
    longUrl: string;
    alias?: string;
}

export async function createUrlController (req: Request, res: Response) {
    const {longUrl, alias}: UrlInput = req.body
    if (!longUrl) {
        throw new AppError("Long URL is required", 400);
    }
    const shortUrl = await createUrlService(longUrl, alias);
    res.status(201).json({
        shortUrl
    })
}