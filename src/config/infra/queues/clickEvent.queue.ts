import { Queue } from "bullmq";
import { createQueueConnection } from "./queueConnection.js";

export interface ClickEventJob {
    id : string;
    urlId : string;
    clickedAt : string;
}

export const clickEventQueue = new Queue<ClickEventJob>("click-event", {
    connection: createQueueConnection(),
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 1000
        },
        //retains the last 1000 completed jobs and removes jobs older than 1 day (86400 seconds)
        removeOnComplete: {
            count: 1000,
            age: 86400
        },
        //retains the last 5000 failed jobs
        removeOnFail: {
            count: 5000
        }
    }
})