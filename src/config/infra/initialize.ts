import databaseConnection from "./db/dbConnection.js";
import { redisConnection } from "./redis/redisConnection.js";

export default async function initialize() {
    //try db connection
    try {
        await databaseConnection();
    }
    catch(error) {
        console.error("Error initializing application", error);
        process.exit(1);
    }

    try {
        await redisConnection();
    }
    catch(error) {
        console.error("Error connecting to Redis", error);
        console.warn("Continuing without Redis connection.");
    }
}