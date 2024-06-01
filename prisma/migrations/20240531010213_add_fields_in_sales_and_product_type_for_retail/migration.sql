-- AlterTable
ALTER TABLE "ProductType" ADD COLUMN     "min_price" DOUBLE PRECISION DEFAULT 0;

-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "minorist" BOOLEAN DEFAULT false;
