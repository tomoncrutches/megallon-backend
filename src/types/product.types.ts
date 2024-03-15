import { Product, ProductType } from '@prisma/client';

export type ProductComplete = {
  data: Product;
  type: ProductType;
};

export type RecipeComplete = {
  data: any;
  product: Product;
};

export type OptionalProduct = {
  [key in keyof Product]?: Product[key];
};
