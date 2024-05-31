/*
  Warnings:

  - You are about to drop the column `min_price` on the `ProductType` table. All the data in the column will be lost.
  - You are about to drop the column `minorist` on the `Sale` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProductType" DROP COLUMN "min_price",
ADD COLUMN     "retail_price" DOUBLE PRECISION DEFAULT 0;

-- AlterTable
ALTER TABLE "Sale" DROP COLUMN "minorist",
ADD COLUMN     "isRetail" BOOLEAN DEFAULT false;
