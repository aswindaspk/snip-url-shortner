import { prisma } from "../db/prisma.js";
import { redis, SHORTCODE_CUCKOO_FILTER_KEY } from "./redis.js";

export default async function cuckooFilterSyncCheck() {
    const cuckooFilterExists = await redis.exists(SHORTCODE_CUCKOO_FILTER_KEY);
    if (cuckooFilterExists) {
        console.log("Cuckoo filter already exists in Redis.");
        return;
    }

    const allShortCodes = await prisma.url.findMany({
        select: {
            shortCode: true
        }
    });

    await redis.sendCommand(["CF.RESERVE", SHORTCODE_CUCKOO_FILTER_KEY, "1000000"]);
    for (const { shortCode } of allShortCodes) {
        await redis.sendCommand(["CF.ADD", SHORTCODE_CUCKOO_FILTER_KEY, shortCode]);
    }
    console.log("Cuckoo filter rebuilt in Redis with all shortCodes from the database.");
}