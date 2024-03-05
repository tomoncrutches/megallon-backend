import { Production, ProductionDetail } from '@prisma/client';

export type ProductionComplete = {
  data: Production;
  details: ProductionDetail[];
};
