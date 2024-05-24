/*
  Warnings:

  - A unique constraint covering the columns `[product_id,material_id]` on the table `MaterialRecipe` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "MaterialRecipe_product_id_material_id_key" ON "MaterialRecipe"("product_id", "material_id");
