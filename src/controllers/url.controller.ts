import type { Request, Response } from "express";
import { createUrlService } from "../services/url.service.js";

export async function createUrlController (req: Request, res: Response) {
    const {longUrl} = req.body
    const shortUrl = await createUrlService(longUrl)
    res.status(201).json({
        shortUrl
    })
}