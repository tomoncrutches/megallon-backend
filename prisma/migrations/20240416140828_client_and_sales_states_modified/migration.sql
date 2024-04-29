-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "attention" TEXT NOT NULL DEFAULT 'Sin horarios';

-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "delivered" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "paid" BOOLEAN NOT NULL DEFAULT false;
