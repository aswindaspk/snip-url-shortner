import { createUrl } from "../repositories/url.repository.js";
import type { createUrlInput } from "../types/url.types.js";
import { Prisma } from "../../generated/prisma/client.js";
import { AppError } from "../error/AppError.js";
import generateShortCode from "../utils/generateShortcode.util.js";
import { redis } from "../config/infra/redis/redis.js";



export async function createUrlService(longUrl: string, alias?: string) {

    if (alias) {
        // check if alias already exists in the database
        const isAliasExists = await redis.sendCommand(["BF.EXISTS", "shortcodes", alias]);
        if (Number(isAliasExists) === 1) {
            throw new AppError("Alias already exists", 400);
        }
        const dataToInsert: createUrlInput = {
            longUrl,
            shortCode: alias
        }
        try {
            const result = await createUrl(dataToInsert);
            //syncs db to redis
            await redis.sendCommand(["BF.ADD", "shortcodes", alias]);
            return result
        } catch (error) {
            //retries if the shortCode is already in use (unique constraint violation)
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            }
            throw error;
        }
    }
    else {
        const MAX_RETRIES = 3

        for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
            const shortCode = generateShortCode();
            const dataToInsert: createUrlInput = {
                longUrl,
                shortCode
            }
            try {
                const result = await createUrl(dataToInsert);
                //syncs db to redis
                await redis.sendCommand(["BF.ADD", "shortcodes", shortCode]);
                return result
            } catch (error) {
                //retries if the shortCode is already in use (unique constraint violation)
                if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                    continue;
                }
                throw error;
            }
        }
    }

    throw new AppError("Failed to generate a unique short code after multiple attempts", 500);

}