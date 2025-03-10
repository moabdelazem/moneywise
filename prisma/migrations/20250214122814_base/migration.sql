/*
  Warnings:

  - You are about to drop the `Goal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Income` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Savings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Transaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Goal" DROP CONSTRAINT "Goal_userId_fkey";

-- DropForeignKey
ALTER TABLE "Income" DROP CONSTRAINT "Income_userId_fkey";

-- DropForeignKey
ALTER TABLE "Savings" DROP CONSTRAINT "Savings_userId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_userId_fkey";

-- DropTable
DROP TABLE "Goal";

-- DropTable
DROP TABLE "Income";

-- DropTable
DROP TABLE "Savings";

-- DropTable
DROP TABLE "Transaction";
