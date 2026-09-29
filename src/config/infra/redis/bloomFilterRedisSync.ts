import { prisma } from "../db/prisma.js";
import { redis } from "./redis.js";

export default async function bloomFilterSyncCheck() {
    try {
        //checks if the bloom filter exists in redis
        const bloomFilterExists = await redis.exists("shortcodes");
        if (bloomFilterExists) {
            console.log("Bloom filter already exists in Redis.");
            return;
        }
        //rebuilds the bloom filter in redis with all the shortCodes from the database
        await redis.del("shortcodes");
        await redis.sendCommand(["BF.RESERVE", "shortcodes", "0.01", "1000000"]);
        const allShortCodes = await prisma.url.findMany(
            {
                select: {
                    shortCode: true
                }
            }
        )
        for (const { shortCode } of allShortCodes) {
            await redis.sendCommand(["BF.ADD", "shortcodes", shortCode]);
        }
        console.log("Bloom filter rebuilt in Redis with all shortCodes from the database.");
    }
    catch (error) {
        console.error("Error syncing bloom filter with Redis", error);
    }
}