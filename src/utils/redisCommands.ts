import { redis, SHORTCODE_CUCKOO_FILTER_KEY } from "../config/infra/redis/redis.js";
import { isCuckooFilterAvailable, isRedisAvailable } from "../config/state.js";
import { AppError } from "../error/AppError.js";

export async function aliasExistsInCF(value: string): Promise<boolean> {
    if (!isRedisAvailable || !isCuckooFilterAvailable) throw new AppError('This feature is not available now', 500);
    const shortCodeExists = await redis.call("CF.EXISTS", SHORTCODE_CUCKOO_FILTER_KEY, value);
    if (Number(shortCodeExists) === 1) return true;
    return false;
}

export async function addAliasToCF(value: string): Promise<void> {
    if (!isRedisAvailable || !isCuckooFilterAvailable) throw new AppError('This feature is not available now', 500);
    const added = await redis.call("CF.ADD", SHORTCODE_CUCKOO_FILTER_KEY, value);
    if (Number(added) !== 1) {
        console.error(`Failed to add alias ${value} to Cuckoo filter. Response: ${added}`);
    }
}

export async function removeAliasFromCF(value: string): Promise<void> {
    if (!isRedisAvailable || !isCuckooFilterAvailable) throw new AppError('This feature is not available now', 500);
    const removed = await redis.call("CF.REMOVE", SHORTCODE_CUCKOO_FILTER_KEY, value);
    if (Number(removed) !== 1) {
        console.error(`Failed to remove alias ${value} from Cuckoo filter. Response: ${removed}`);
    }
}

export async function incCounterInRedis(key: string): Promise<void> {
    if (!isRedisAvailable) console.log("Redis is not available, skipping incrementing counter.");
    const incremented = await redis.incr(key);
    if (incremented === null) {
        console.error(`Failed to increment counter for key ${key}.`);
    }
}

export async function getCounterFromRedis(key: string): Promise<number> {
    if (!isRedisAvailable) {
        console.log("Redis is not available, returning 0 for counter.");
        return 0;
    }
    const count = await redis.get(key);
    if (count === null) {
        console.log(`Counter for key ${key} does not exist, returning 0.`);
        return 0;
    }
    return parseInt(count, 10);
}

export async function resetCounterInRedis(key: string): Promise<void> {
    if (!isRedisAvailable) {
        console.log("Redis is not available, skipping resetting counter.");
        return;
    }
    const reset = await redis.set(key, 0);
    if (reset !== "OK") {
        console.error(`Failed to reset counter for key ${key}. Response: ${reset}`);
    }
}