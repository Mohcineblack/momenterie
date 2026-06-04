/*
  Warnings:

  - You are about to alter the column `discountValue` on the `Coupon` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `minPurchase` on the `Coupon` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `maxDiscount` on the `Coupon` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - The `status` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `subtotal` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `shippingCost` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `tax` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `discount` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `total` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - The `paymentStatus` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `price` on the `OrderItem` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `basePrice` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `priceModifier` on the `ProductVariant` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PROCESSING', 'IN_PRODUCTION', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('UNPAID', 'PAID', 'FAILED', 'REFUNDED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Coupon" ALTER COLUMN "discountValue" SET DATA TYPE INTEGER,
ALTER COLUMN "minPurchase" SET DATA TYPE INTEGER,
ALTER COLUMN "maxDiscount" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "status",
ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "subtotal" SET DATA TYPE INTEGER,
ALTER COLUMN "shippingCost" SET DEFAULT 0,
ALTER COLUMN "shippingCost" SET DATA TYPE INTEGER,
ALTER COLUMN "tax" SET DEFAULT 0,
ALTER COLUMN "tax" SET DATA TYPE INTEGER,
ALTER COLUMN "discount" SET DEFAULT 0,
ALTER COLUMN "discount" SET DATA TYPE INTEGER,
ALTER COLUMN "total" SET DATA TYPE INTEGER,
DROP COLUMN "paymentStatus",
ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'UNPAID';

-- AlterTable
ALTER TABLE "OrderItem" ALTER COLUMN "price" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "basePrice" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "ProductVariant" ALTER COLUMN "priceModifier" SET DEFAULT 0,
ALTER COLUMN "priceModifier" SET DATA TYPE INTEGER;

-- CreateTable
CREATE TABLE "StripeWebhookEvent" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StripeWebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StripeWebhookEvent_eventId_key" ON "StripeWebhookEvent"("eventId");
