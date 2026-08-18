import type { Request, Response } from "express";
import { getOriginalUrl } from "../services/redirect.service.js";
import type { RedirectParams } from "../types/redirect.types.js";

export async function redirectController(req: Request<RedirectParams>, res: Response) {
    const { shortCode } = req.params;
    if (!shortCode) {
        return res.status(400).json({ message: "Short code is required" });
    }
    const originalUrl = await getOriginalUrl(shortCode);
    if (!originalUrl) {
        return res.status(404).json({ message: "Original URL not found" });
    }
    return res.redirect(originalUrl);
}