import { prisma } from "./prisma.js";

export async function checkDatabaseConnection() {
    try {
        await prisma.$connect();
        await prisma.$queryRaw`SELECT 1`;
        console.log("Database connection successful.");
    } catch (error) {
        console.error("Error connecting to database:", error);
    }
}