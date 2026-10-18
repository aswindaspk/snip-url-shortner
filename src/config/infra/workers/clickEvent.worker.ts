import type { Worker } from "bullmq";
import type { ClickEventJob } from "../queues/clickEvent.queue.js";

let worker: Worker<ClickEventJob> | undefined;
let shuttingDown = false;