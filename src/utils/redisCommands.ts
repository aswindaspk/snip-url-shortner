import { redis, SHORTCODE_CUCKOO_FILTER_KEY } from "../config/infra/redis/redis.js";
import { isCuckooFilterAvailable, isRedisAvailable } from "../config/state.js";
import { AppError } from "../error/AppError.js";

export async function aliasExistsInCF(value: string): Promise<boolean> {
    if (!isRedisAvailable || !isCuckooFilterAvailable) throw new AppError('This feature is not available now', 500);
    const shortCodeExists = await redis.sendCommand(["CF.EXISTS", SHORTCODE_CUCKOO_FILTER_KEY, value]);
    return Number(shortCodeExists) === 1;
}

export async function addAliasToCF(value: string): Promise<void> {
    if (!isRedisAvailable || !isCuckooFilterAvailable) throw new AppError('This feature is not available now', 500);
    await redis.sendCommand(["CF.ADD", SHORTCODE_CUCKOO_FILTER_KEY, value]);
}

export async function removeAliasFromCF(value: string): Promise<void> {
    if (!isRedisAvailable || !isCuckooFilterAvailable) throw new AppError('This feature is not available now', 500);
    await redis.sendCommand(["CF.REMOVE", SHORTCODE_CUCKOO_FILTER_KEY, value]);
}
