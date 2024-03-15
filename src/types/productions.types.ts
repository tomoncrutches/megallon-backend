import { Production, ProductionDetail } from '@prisma/client';

export type ProductionComplete = {
  data: Production;
  details: ProductionDetail[];
};

export type OptionalProduction = {
  [key in keyof Production]?: Production[key];
};
