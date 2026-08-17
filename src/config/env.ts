import "dotenv/config"
const PORT = process.env.PORT || 4000;

export const env = {
    PORT,
    DATABASE_URL: process.env.DATABASE_URL
}

