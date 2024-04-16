import { Client, Sale } from '@prisma/client';

import { ProductComplete } from './product.types';

export interface ProductBasic {
  id: string;
  price: number;
  quantity: number;
}

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
