import { prisma } from "../config/db/prisma.js";

export async function getOriginalUrlFromRepository(shortCode: string) {
    const originalUrl = await prisma.url.findUnique(
        {
            where: {
                shortCode
            }
        }
    );
    console.log("originalUrl", originalUrl?.longUrl);
    return originalUrl?.longUrl || null;
}