import { getOriginalUrlFromRepository } from "../repositories/redirect.repository.js";

export async function getOriginalUrl(shortCode: string) {
    return getOriginalUrlFromRepository(shortCode);
}