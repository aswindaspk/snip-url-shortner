import { randomInt } from "node:crypto";
import { createUrl } from "../repositories/url.repository.js";
import type { createUrlInput } from "../types/url.types.js";

export async function createUrlService(longUrl: string) {

    function generateShortCode(): string {
        const BASE62CHAR: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const CODE_LENGTH: number = 8;
        let shortCode = "";
        for (let i=0; i<CODE_LENGTH; i++) {
            shortCode += BASE62CHAR[randomInt(0, BASE62CHAR.length)];
        }
        return shortCode;
    }

    const shortCode = generateShortCode();
    console.log(shortCode);
    const dataToInsert: createUrlInput = {
        longUrl,
        shortCode
    }
    return createUrl(dataToInsert);

}