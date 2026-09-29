import { createClient } from 'redis';
import { env } from '../../env.js';


const REDIS_URL = env.REDIS_URL;
if (!REDIS_URL) {
    throw new Error("REDIS_URL is not defined in the environment variables");
}

export const redis = createClient({
    url: REDIS_URL
});

redis.on('error', (err) => console.error('Redis Client Error'));
