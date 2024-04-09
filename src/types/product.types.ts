import { Material, MaterialRecipe, Product, ProductType } from '@prisma/client';

export type ProductComplete = {
  data: Product;
  type: ProductType;
};
export type OptionalMaterialRecipe = {
  [key in keyof MaterialRecipe]?: MaterialRecipe[key];
};

export interface ProductForCreate extends Product {
  recipes: OptionalMaterialRecipe[];
}

export type RecipeComplete = {
  data: any;
  material: Material;
};

export type OptionalProduct = {
  [key in keyof Product]?: Product[key];
};
