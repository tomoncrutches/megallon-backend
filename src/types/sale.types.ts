import { Sale } from '@prisma/client';

type ProductBasic = {
  id: string;
  quantity: number;
};

export interface SaleExtended {
  data: Sale;
  items: ProductBasic[];
}
