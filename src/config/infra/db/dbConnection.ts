import { prisma } from "./prisma.js";

export default async function databaseConnection() {
    try {
        await prisma.$connect();
        await prisma.$queryRaw`SELECT 1`;
        console.log("Database connected.");
    } catch (error) {
        console.error("Error connecting to database", error);
        throw error;
    }
}

