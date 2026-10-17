import { env } from "../../env.js";
import {Redis} from "ioredis";

export function createQueueConnection() {
    return new Redis(env.REDIS_URL, {
        // Producer requests should fail rather than wait indefinitely.
        maxRetriesPerRequest: 1,
    })
}

export function createConsumerConnection() {
    return new Redis(env.REDIS_URL, {
        // Consumer requests should wait indefinitely for a response.
        maxRetriesPerRequest: null,
    })
}