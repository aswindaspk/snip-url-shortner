import "dotenv/config"
const PORT = process.env.PORT || 3000;

export const env = {
    PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    REDIS_URL: process.env.REDIS_URL
}

