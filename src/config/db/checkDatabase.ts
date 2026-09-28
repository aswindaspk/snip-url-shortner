import bloomFilterSyncCheck from "../../utils/bloomFilterRedisSync.js";
import { prisma } from "./prisma.js";
import { redis } from "./redis.js";

export async function checkDatabaseConnection() {
    try {
        await prisma.$connect();
        await prisma.$queryRaw`SELECT 1`;
        console.log("Database connected.");
        const redisResponse = await redis.ping();
        if (redisResponse === 'PONG') {
            console.log('Redis connected.');
            await bloomFilterSyncCheck();
            
        }
    } catch (error) {
        console.error("Error connecting to database/ Redis:", error);
        process.exit(1); // Exit the process with a failure code
    }
}