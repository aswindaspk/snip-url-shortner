import { Worker, type Job } from "bullmq";
import type { ClickEventJob } from "../queues/clickEvent.queue.js";
import { ClickEventBatcher } from "./clickEvent.batch.js";
import { persistBatch } from "../../../repositories/persistClicks.repository.js";
import databaseConnection from "../db/dbConnection.js";
import { createConsumerConnection } from "../queues/queueConnection.js";
import { prisma } from "../db/prisma.js";

let worker: Worker<ClickEventJob> | undefined;
let shuttingDown = false;
export const connection = createConsumerConnection()

const batcher = new ClickEventBatcher(persistBatch)

async function startWorker(): Promise<void> {
    await databaseConnection();
    worker = new Worker<ClickEventJob>('click-event',
        async (job: Job<ClickEventJob>) => {
            await batcher.process(job)
        },
        {
            connection,
            concurrency: 100
        }
    )

    worker.on('completed', (job) => {
        console.log("Completed click job", job.id)
    });

    worker.on("failed", (job, error) => {
        console.error(`Click job ${job?.id} failed:`, error);
    });

    worker.on("error", (error) => {
        console.error("BullMQ worker error:", error);
    });

    console.log("Click-event worker started");
}

async function shutdown(signal: string) {
    if (shuttingDown) return;
    shuttingDown = true;

    console.log('Received', signal, "to shutdown worker");

    try {
        //stop accepting new jobs and wait to complete existing jobs
        await worker?.close()

        //drain any remaining pending batches
        await batcher.flush()
        await connection.quit()
        await prisma.$connect()
        console.log("Worker shut down gracefully");

    }
    catch (err) {
        console.error("Worker shutdown failed:", err);
        process.exitCode = 1;
    }

}

process.once('SIGINT', ()=> {
    void shutdown('SIGINT')
});

process.once('SIGTERM', ()=> {
    void shutdown('SIGTERM')
});

startWorker().catch(async (error) => {
  console.error("Failed to start click-event worker:", error);
  process.exitCode = 1;

  await connection.quit().catch(() => undefined);
  await prisma.$disconnect().catch(() => undefined);
});