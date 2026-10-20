/*
  Warnings:

  - A unique constraint covering the columns `[userId,shortCode]` on the table `Url` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "clickEvent" (
    "id" TEXT NOT NULL,
    "urlId" TEXT NOT NULL,
    "clickedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clickEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "clickEvent_id_urlId_idx" ON "clickEvent"("id", "urlId");

-- CreateIndex
CREATE UNIQUE INDEX "Url_userId_shortCode_key" ON "Url"("userId", "shortCode");

-- AddForeignKey
ALTER TABLE "clickEvent" ADD CONSTRAINT "clickEvent_urlId_fkey" FOREIGN KEY ("urlId") REFERENCES "Url"("shortCode") ON DELETE CASCADE ON UPDATE CASCADE;
