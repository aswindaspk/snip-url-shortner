import "dotenv/config"
const PORT = process.env.PORT || 3000;
const baseUrl = "http://localhost:3000"
const DATABASE_URL = process.env.DATABASE_URL;
const REDIS_URL = process.env.REDIS_URL;
const NODE_ENV = process.env.NODE_ENV;
const BETTER_AUTH_SECRET = process.env.BETTER_AUTH_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

if(!DATABASE_URL || !REDIS_URL || !NODE_ENV || !BETTER_AUTH_SECRET || !GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    throw new Error("Missing required environment variables");
}

export const env = {
    PORT,
    baseUrl,
    DATABASE_URL,
    REDIS_URL,
    NODE_ENV,
    BETTER_AUTH_SECRET,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET
}

