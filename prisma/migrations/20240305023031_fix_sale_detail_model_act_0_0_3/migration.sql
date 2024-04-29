/*
  Warnings:

  - You are about to drop the column `productType_id` on the `SaleDetail` table. All the data in the column will be lost.
  - Added the required column `product_id` to the `SaleDetail` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SaleDetail" DROP CONSTRAINT "SaleDetail_productType_id_fkey";

-- AlterTable
ALTER TABLE "SaleDetail" DROP COLUMN "productType_id",
ADD COLUMN     "product_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "SaleDetail" ADD CONSTRAINT "SaleDetail_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
