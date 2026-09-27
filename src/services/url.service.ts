import { randomInt } from "node:crypto";
import { createUrl } from "../repositories/url.repository.js";
import type { createUrlInput } from "../types/url.types.js";
import { Prisma } from "../../generated/prisma/client.js";
import { AppError } from "../error/AppError.js";

export async function createUrlService(longUrl: string) {

    function generateShortCode(): string {
        const BASE62CHAR: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const CODE_LENGTH: number = 8;
        let shortCode = "";
        for (let i = 0; i < CODE_LENGTH; i++) {
            shortCode += BASE62CHAR[randomInt(0, BASE62CHAR.length)];
        }
        return shortCode;
    }

    const MAX_RETRIES = 3

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        const shortCode = generateShortCode();
        const dataToInsert: createUrlInput = {
            longUrl,
            shortCode
        }
        try {
            return createUrl(dataToInsert);
        } catch (error) {
            //retries if the shortCode is already in use (unique constraint violation)
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                continue;
            }
            throw error;
        }
    }

    throw new AppError("Failed to generate a unique short code after multiple attempts", 500);

}