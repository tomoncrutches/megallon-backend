/*
  Warnings:

  - Added the required column `quantity` to the `MaterialRecipe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MaterialRecipe" ADD COLUMN     "quantity" DOUBLE PRECISION NOT NULL;
