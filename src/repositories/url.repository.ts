import { prisma } from "../config/db/prisma.js";
import type { createUrlInput } from "../types/url.types.js";

export async function createUrl (data: createUrlInput) {
    return prisma.url.create(
        {
            data: {
                longUrl: data.longUrl,
                shortCode: data.shortCode
            }
        }
    )
}