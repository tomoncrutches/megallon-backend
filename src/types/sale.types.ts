import { Client, Sale } from '@prisma/client';

import { ProductComplete } from './product.types';

type ProductBasic = {
  id: string;
  quantity: number;
};

export interface SaleToCreate {
  data: Sale;
  items: ProductBasic[];
}

export interface SaleExtended extends Sale {
  client: Client;
}

export interface SaleComplete extends SaleExtended {
  items: ProductComplete[];
}
