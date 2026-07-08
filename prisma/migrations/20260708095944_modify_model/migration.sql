/*
  Warnings:

  - The values [INACTIVE] on the enum `PeropertyStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'BLOCKED');

-- AlterEnum
BEGIN;
CREATE TYPE "PeropertyStatus_new" AS ENUM ('AVAILABLE', 'RENTED', 'UNAVAILABLE');
ALTER TABLE "public"."properties" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "properties" ALTER COLUMN "status" TYPE "PeropertyStatus_new" USING ("status"::text::"PeropertyStatus_new");
ALTER TYPE "PeropertyStatus" RENAME TO "PeropertyStatus_old";
ALTER TYPE "PeropertyStatus_new" RENAME TO "PeropertyStatus";
DROP TYPE "public"."PeropertyStatus_old";
ALTER TABLE "properties" ALTER COLUMN "status" SET DEFAULT 'AVAILABLE';
COMMIT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
ALTER COLUMN "isVerified" DROP NOT NULL;
