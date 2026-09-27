import type { Request, Response } from "express";
import { createUrlService } from "../services/url.service.js";
import { AppError } from "../error/AppError.js";

export async function createUrlController (req: Request, res: Response) {
    const {longUrl} = req.body
    if (!longUrl) {
        throw new AppError("Long URL is required", 400);
    }
    const shortUrl = await createUrlService(longUrl)
    res.status(201).json({
        shortUrl
    })
}