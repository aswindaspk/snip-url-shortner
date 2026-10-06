import { createUrl, deleteUrlRepository, updateUrlRepository } from "../repositories/url.repository.js";
import { Prisma } from "../../generated/prisma/client.js";
import { AppError } from "../error/AppError.js";
import generateShortCode from "../utils/generateShortcode.util.js";
import { redis, SHORTCODE_CUCKOO_FILTER_KEY } from "../config/infra/redis/redis.js";
import { isCuckooFilterAvailable, isRedisAvailable } from "../config/state.js";
import generateQrCode from "../utils/generateQrCode.js";
import { env } from "../config/env.js";
import { addAliasToCF, aliasExistsInCF, removeAliasFromCF } from "../utils/redisCommands.js";

export interface createUrlInput {
    longUrl: string,
    shortCode: string,
    userId?: string
}

export async function createUrlService(longUrl: string, alias?: string, userId?: string) {

    if (alias) {
        // Check if the alias is already in the Cuckoo filter.
        const aliasExists = await aliasExistsInCF(alias);
        if (aliasExists) throw new AppError("Alias already exists", 400);
        const result = await sendData(longUrl, alias, userId);
        try {
            //syncs alias to redis
            await addAliasToCF(alias);
        } catch (error) {
            console.error("Error adding alias to Redis Cuckoo filter:", error);
        }
        return result;
    }
    else {
        const MAX_RETRIES = 3

        for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
            const shortCode = generateShortCode();
            try {
                const result = await sendData(longUrl, shortCode, userId);
                if (isRedisAvailable && isCuckooFilterAvailable) await addAliasToCF(shortCode);
                return result;
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


    async function sendData(longUrl: string, shortCode: string, userId?: string) {
        if (userId) {
            const dataToInsert: createUrlInput = {
                longUrl,
                shortCode,
                userId
            }
            const result = await createUrl(dataToInsert);
            //generate qr code
            const qrCode = await generateQrCode(env.baseUrl + '/' + shortCode);
            return { ...result, qrCode };
        }
        else {
            const dataToInsert: createUrlInput = {
                longUrl,
                shortCode
            }
            const result = await createUrl(dataToInsert);
            //generate qr code
            const qrCode = await generateQrCode(env.baseUrl + '/' + shortCode);
            return { ...result, qrCode };
        }
    }

}


export async function deleteUrlService(shortCode: string, userId: string) {
    const deletedUrl = await deleteUrlRepository(shortCode, userId);
    if (isRedisAvailable && isCuckooFilterAvailable && deletedUrl) {
        const aliasExists = await aliasExistsInCF(shortCode);
        if (aliasExists) {
            //delete from redis
            await removeAliasFromCF(shortCode);
        }
    }
    return deletedUrl;
}


export async function updateUrlService(shortCode: string, userId: string, aliasChanged: boolean, urlChanged: boolean, newLongUrl?: string | undefined, alias?: string | undefined) {
    if (aliasChanged && alias) {
        if (!isRedisAvailable || !isCuckooFilterAvailable) throw new AppError('This feature is not available now', 500)
        const aliasExists = await aliasExistsInCF(alias);
        if (aliasExists) throw new AppError("Alias already exists", 400);
        //update the alias in the database and redis
        const updatedUrl = await updateUrlRepository(shortCode, userId, aliasChanged, urlChanged, newLongUrl, alias);
        const oldAliasExists = await aliasExistsInCF(shortCode);
        if (oldAliasExists) {
            await removeAliasFromCF(shortCode);
        }
        await addAliasToCF(alias);
        return updatedUrl;
    }
    else if (urlChanged && newLongUrl) {
        //update the longUrl in the database
        const updatedUrl = await updateUrlRepository(shortCode, userId, aliasChanged, urlChanged, newLongUrl);
    }
    else if (aliasChanged && urlChanged && alias && newLongUrl) {
        if (!isRedisAvailable || !isCuckooFilterAvailable) throw new AppError('This feature is not available now', 500)
        const aliasExists = await aliasExistsInCF(alias);
        if (aliasExists) throw new AppError("Alias already exists", 400);
        //update the alias and longUrl in the database and redis
        const updatedUrl = await updateUrlRepository(shortCode, userId, aliasChanged, urlChanged, newLongUrl, alias);
        const oldAliasExists = await aliasExistsInCF(shortCode);
        if (oldAliasExists) {
            await removeAliasFromCF(shortCode);
        }
        await addAliasToCF(alias);
        return updatedUrl;
    }
}