/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Savings` table. All the data in the column will be lost.
  - Added the required column `lastUpdated` to the `Savings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Savings" DROP COLUMN "updatedAt",
ADD COLUMN     "category" TEXT DEFAULT 'Uncategorized',
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "goalProgress" DOUBLE PRECISION,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "lastUpdated" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "Reminder" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "category" "Category" NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "frequency" TEXT,
    "lastSent" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reminder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Reminder_userId_status_idx" ON "Reminder"("userId", "status");

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
