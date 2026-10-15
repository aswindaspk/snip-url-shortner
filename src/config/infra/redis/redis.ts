import { env } from '../../env.js';
import { Redis } from 'ioredis';


const REDIS_URL = env.REDIS_URL;
if (!REDIS_URL) {
    throw new Error("REDIS_URL is not defined in the environment variables");
}

export const redis = new Redis(REDIS_URL, {
    maxRetriesPerRequest: 1,
});

export const SHORTCODE_CUCKOO_FILTER_KEY = "shortcodes";

redis.on('error', (err) => console.error('Redis Client Error'));
