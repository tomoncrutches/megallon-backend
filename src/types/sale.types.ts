import { Product, Sale } from '@prisma/client';

type ProductBasic = {
  id: string;
  quantity: number;
};

export interface SaleToCreate {
  data: Sale;
  items: ProductBasic[];
}

export interface SaleExtended {
  data: Sale;
  items: Product[];
}
