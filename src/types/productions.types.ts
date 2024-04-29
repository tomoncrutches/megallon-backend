import { Production, ProductionDetail } from '@prisma/client';

export type ProductionComplete = {
  data: Production;
  details: ProductionDetail[];
};

export interface ProductionForCreate extends Production {
  products: { id: string; quantity: number; recipe_quantity: number }[];
}

export type OptionalProduction = {
  [key in keyof Production]?: Production[key];
};
