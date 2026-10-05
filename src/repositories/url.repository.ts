import { prisma } from "../config/infra/db/prisma.js";
import type { createUrlInput } from "../services/url.service.js";

export async function createUrl (data: createUrlInput) {
    if (data.userId) {
        return prisma.url.create(
        {
            data: {
                longUrl: data.longUrl,
                shortCode: data.shortCode,
                userId: data.userId
            }
        }
    )
    } else {
        return prisma.url.create(
        {
            data: {
                longUrl: data.longUrl,
                shortCode: data.shortCode   
            }
        }
    )
    }
}