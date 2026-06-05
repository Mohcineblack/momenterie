-- AlterTable
ALTER TABLE "Order" ADD COLUMN "prodigiOrderId" TEXT;
ALTER TABLE "Order" ADD COLUMN "supplierCostCents" INTEGER;
ALTER TABLE "Order" ADD COLUMN "carrier" TEXT;
ALTER TABLE "Order" ADD COLUMN "trackingUrl" TEXT;
ALTER TABLE "Order" ADD COLUMN "shippedAt" TIMESTAMP(3);
ALTER TABLE "Order" ADD COLUMN "fulfillmentError" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Order_prodigiOrderId_key" ON "Order"("prodigiOrderId");
