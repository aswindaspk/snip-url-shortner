import { createUrl } from "../repositories/url.repository.js";
import { Prisma } from "../../generated/prisma/client.js";
import { AppError } from "../error/AppError.js";
import generateShortCode from "../utils/generateShortcode.util.js";
import { redis } from "../config/infra/redis/redis.js";
import { isBloomFilterAvailable, isRedisAvailable } from "../config/state.js";
import generateQrCode from "../utils/generateQrCode.js";
import { env } from "../config/env.js";

export interface createUrlInput {
    longUrl: string,
    shortCode: string
}

export async function createUrlService(longUrl: string, alias?: string) {

    if (alias) {
        // check if alias already exists in the database
        if (!isRedisAvailable || !isBloomFilterAvailable) throw new AppError('This feature is not available now', 500)
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
            //generate qrcode
            const qrCode = await generateQrCode(env.baseUrl+'/'+alias);
            //syncs db to redis
            await redis.sendCommand(["BF.ADD", "shortcodes", alias]);
            return {...result, qrCode};
        } catch (error) {
            throw new AppError('Could not generate short code', 500)
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
                //generate qrcode
                const qrCode = await generateQrCode(env.baseUrl+'/'+shortCode);
                //syncs db to redis
                if (isBloomFilterAvailable && isRedisAvailable) await redis.sendCommand(["BF.ADD", "shortcodes", shortCode]);
                return {...result, qrCode};
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