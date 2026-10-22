import type { Prisma } from "@prisma/client/extension";
import { prisma } from "../config/infra/db/prisma.js";
import type { ClickEventJob } from "../config/infra/queues/clickEvent.queue.js";

export async function persistBatch(events: ClickEventJob[]): Promise<void> {
    if (events.length === 0) return;

    await prisma.$transaction(
        async (tx: Prisma.TransactionClient) => {
            const inserted = await tx.clickEvent.createManyAndReturn({
                data: events.map(event=>({
                    id: event.id,
                    urlId: event.urlId,
                    clickedAt: new Date(event.clickedAt)

                })),
                skipDuplicates: true,
                select: {
                    urlId: true
                }
            });
            const counts = new Map<string, number>

            for(const event of inserted){
                counts.set(event.urlId, (counts.get(event.urlId) ?? 0) + 1)
            }

            for (const [urlId, count] of counts){
                await tx.url.update({
                    where: {shortCode: urlId},
                    data: {
                        clickCount: {
                            increment: count
                        }
                    }
                })
            }
        }
    );
    console.log("Persisted", events.length, "click events")
}