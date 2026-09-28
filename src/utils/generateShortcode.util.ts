import { randomInt } from "node:crypto";
export default function generateShortCode(): string {
    const BASE62CHAR: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const CODE_LENGTH: number = 8;
    let shortCode = "";
    for (let i = 0; i < CODE_LENGTH; i++) {
        shortCode += BASE62CHAR[randomInt(0, BASE62CHAR.length)];
    }
    return shortCode;
}