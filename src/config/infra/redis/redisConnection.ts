import { setBloomFilterAvailability, setRedisAvailability } from "../../state.js";
import bloomFilterSyncCheck from "./bloomFilterRedisSync.js";
import { redis } from "./redis.js";

export async function redisConnection() {
    try {
        await redis.connect();

        const redisResponse = await redis.ping();

        if (redisResponse !== "PONG") {
            throw new Error("Redis health check failed");
        }
        setRedisAvailability(true);
        console.log("Redis connected.");
    } catch (error) {
        console.error("Redis unavailable:", error);
        return;
    }

    try {
        await bloomFilterSyncCheck();
        setBloomFilterAvailability(true);
        console.log("Bloom filter ready.");
    } catch (error) {
        console.error("Bloom filter sync failed:", error);
        console.warn("Continuing without Bloom filter.");
    }
}