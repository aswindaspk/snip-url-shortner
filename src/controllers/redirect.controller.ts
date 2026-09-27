import type { Request, Response } from "express";
import { getOriginalUrl } from "../services/redirect.service.js";
import type { RedirectParams } from "../types/redirect.types.js";
import { AppError } from "../error/AppError.js";

export async function redirectController(req: Request<RedirectParams>, res: Response) {
    const { shortCode } = req.params;
    if (!shortCode) {
        throw new AppError("Short code is required", 400);
    }
    const originalUrl = await getOriginalUrl(shortCode);// Log the original URL for debugging
    return res.redirect(originalUrl!);
}