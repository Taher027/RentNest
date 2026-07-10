/*
  Warnings:

  - You are about to drop the column `moveOutTime` on the `rental-requests` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "rental-requests" DROP COLUMN "moveOutTime",
ADD COLUMN     "moveOutDate" TIMESTAMP(3);
