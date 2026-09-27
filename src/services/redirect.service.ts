import { AppError } from "../error/AppError.js";
import { getOriginalUrlFromRepository } from "../repositories/redirect.repository.js";

export async function getOriginalUrl(shortCode: string) {
    const originalUrl = await getOriginalUrlFromRepository(shortCode);// Log the original URL for debugging
    if (!originalUrl) {
        throw new AppError("Original URL not found", 404);
    }
    return originalUrl;
}