/*
  Warnings:

  - A unique constraint covering the columns `[tenantId,propertyId]` on the table `rental-requests` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "rental-requests_tenantId_propertyId_key" ON "rental-requests"("tenantId", "propertyId");
