import { prisma } from "../config/infra/db/prisma.js";
import type { createUrlInput } from "../services/url.service.js";

export async function createUrl (data: createUrlInput) {

    const dataToInsert: createUrlInput = {
        longUrl: data.longUrl,
        shortCode: data.shortCode
    }

    if (data.userId) {
        dataToInsert.userId = data.userId
    }
    return prisma.url.create(
        {
            data: dataToInsert
        }
    )
}

export async function deleteUrlRepository(shortCode: string, userId: string) {
    return prisma.url.delete({
        where: {
            shortCode,
            userId
        }
    })
}

export async function updateUrlRepository( shortCode: string, userId: string, aliasChanged: boolean, urlChanged: boolean, newLongUrl?: string, alias?: string) {
    
    const data: {
        longUrl?: string;
        alias?: string;
    } = {}

    if (aliasChanged && urlChanged && alias && newLongUrl) {
        data.longUrl = newLongUrl;
        data.alias = alias; 
    }
    else if (aliasChanged && alias) {
        data.alias = alias;
    }
    else if (urlChanged && newLongUrl) {
        data.longUrl = newLongUrl;
    }

    return prisma.url.update({
        where: {
            shortCode,
            userId
        },
        data,
    });
}