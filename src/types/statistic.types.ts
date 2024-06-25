export interface ProductsStatistics {
  name: string;
  quantitySold: number;
  totalAmount: number;
}

export interface ClientStatistics {
  name: string;
  quantityPurchases: number;
  quantityProducts: number;
  totalAmount: number;
}

export interface generalStatistics {
  salesQuantity: number;
  incomesTotal: number;
  productsSold: number;
}
