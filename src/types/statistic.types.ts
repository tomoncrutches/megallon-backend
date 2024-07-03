export interface ProductStatistics {
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

export interface GeneralStatistics {
  salesQuantity: number;
  incomesTotal: number;
  productsSold: number;
}
