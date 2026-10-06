import { setCuckooFilterAvailability, setRedisAvailability } from "../../state.js";
import cuckooFilterSyncCheck from "./cuckooFilterRedisSync.js";
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
        await cuckooFilterSyncCheck();
        setCuckooFilterAvailability(true);
        console.log("Cuckoo filter ready.");
    } catch (error) {
        console.error("Cuckoo filter sync failed:", error);
        console.warn("Continuing without Cuckoo filter.");
    }
}