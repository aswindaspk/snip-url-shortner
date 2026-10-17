import type { Job } from "bullmq";
import type { ClickEventJob } from "../queues/clickEvent.queue.js";

const BATCH_SIZE = 100;
const FLUSH_INTERVAL = 10000; // Flush every 10 seconds

type PendingClick = {
    job: Job<ClickEventJob>;
    resolve: () => void;
    reject: (error: Error) => void;
};

export class ClickEventBatcher {
    private pendingClicks: PendingClick[] = [];
    private timer: ReturnType<typeof setTimeout> | null = null;
    private flushing: Promise<void> | null = null;

    constructor(private readonly persistBatch: (events: ClickEventJob[]) => Promise<void>) { }

    process(job: Job<ClickEventJob>): Promise<void> {
        return new Promise((resolve, reject) => {
            this.pendingClicks.push({ job, resolve, reject });

            if (this.pendingClicks.length >= BATCH_SIZE) {
                this.flush();
            }
            else {
                this.scheduleFlush();
            }
        });
    }

    private scheduleFlush() {
        if (this.timer || this.flushing) return;
        this.timer = setTimeout(() => {
            this.timer = null;
            this.flush();
        }, FLUSH_INTERVAL);
    }

    async flush(): Promise<void> {
        {
            if (this.flushing) {
                return this.flushing;
            }
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
            }

            if (this.pendingClicks.length === 0) return;

            const batch = this.pendingClicks.splice(0, BATCH_SIZE);

            this.flushing = (async () => {
                try {
                    await this.persistBatch(batch.map(({ job }) => job.data));
                    for (const item of batch) item.resolve()
                }
                catch (err) {
                    const failure = err instanceof Error ? err : new Error(String(err));
                    for (const item of batch) item.reject(failure)
                }
            })();

            try {
                await this.flushing
            }
            finally {
                this.flushing = null

                if (this.pendingClicks.length >= BATCH_SIZE) {
                    void this.flush();
                } else if (this.pendingClicks.length > 0) {
                    this.scheduleFlush();
                }
            }
        }
    }

}