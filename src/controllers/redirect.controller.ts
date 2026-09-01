import type { Request, Response } from "express";
import { getOriginalUrl } from "../services/redirect.service.js";
import type { RedirectParams } from "../types/redirect.types.js";
import { AppError } from "../error/AppError.js";

export async function redirectController(req: Request<RedirectParams>, res: Response) {
    const { shortCode } = req.params;
    if (!shortCode) {
        throw new AppError("Short code is required", 400, false);
    }
    const originalUrl = await getOriginalUrl(shortCode);
    if (!originalUrl) {
        throw new AppError("Original URL not found", 404, false);
    }
    return res.redirect(originalUrl);
}