import { prisma } from "../config/db/prisma.js";
import { AppError } from "../error/AppError.js";

export async function getOriginalUrlFromRepository(shortCode: string) {
    const originalUrl = await prisma.url.findUnique(
        {
            where: {
                shortCode
            }
        }
    );
    if (!originalUrl) {
        throw new AppError("Original URL not found", 404, false);
    }
    return originalUrl?.longUrl || null;
}