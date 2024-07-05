import {
  ClientStatistics,
  GeneralStatistics,
  ProductStatistics,
} from 'src/types/statistic.types';
import { Injectable, Logger } from '@nestjs/common';

import { ClientsService } from 'src/clients/clients.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductsService } from 'src/products/products.service';
import { SalesService } from 'src/sales/sales.service';
import { TransactionService } from 'src/transaction/transaction.service';

@Injectable()
export class StatisticsService {
  constructor(
    private prisma: PrismaService,
    private productsService: ProductsService,
    private transactionService: TransactionService,
    private clientsService: ClientsService,
    private salesService: SalesService,
  ) {}
  private readonly logger = new Logger('StatisticsService');

  async getProductsSold(
    timeRange?: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<ProductStatistics[]> {
    try {
      const filterCondition = this.getCondition(timeRange, startDate, endDate);
      const sales = await this.prisma.sale.findMany({
        where: filterCondition,
        include: {
          saleDetail: {
            include: {
              product: {
                include: {
                  type: true,
                },
              },
            },
          },
        },
      });
      const summary: { [key: string]: ProductStatistics } = sales.reduce(
        (acc, sale) => {
          sale.saleDetail.forEach((item) => {
            const productId = item.product.id;
            const productName = item.product.name;
            const productPrice = item.product.type.price;

            if (!acc[productId]) {
              acc[productId] = {
                name: productName,
                quantitySold: 0,
                totalAmount: 0,
              };
            }

            acc[productId].quantitySold += item.quantity;
            acc[productId].totalAmount += productPrice * item.quantity;
          });

          return acc;
        },
        {} as { [key: string]: ProductStatistics },
      );

      const result: ProductStatistics[] = Object.values(summary);

      return result.sort((a, b) => b.quantitySold - a.quantitySold);
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async getClientsPurchases(
    timeRange?: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<ClientStatistics[]> {
    try {
      const filterCondition = this.getCondition(timeRange, startDate, endDate);
      const clients = await this.prisma.client.findMany({
        include: {
          sale: {
            where: filterCondition,
            include: {
              saleDetail: true,
            },
          },
        },
      });

      const summary: { [key: string]: ClientStatistics } = clients.reduce(
        (acc, client) => {
          const clientId = client.id;
          client.sale.forEach((item) => {
            if (!acc[clientId]) {
              acc[clientId] = {
                name: client.name,
                quantityPurchases: 0,
                quantityProducts: 0,
                totalAmount: 0,
              };
            }
            acc[clientId].quantityPurchases++;

            let productsQuantity = 0;
            item.saleDetail.forEach((item) => {
              productsQuantity += item.quantity;
            });

            acc[clientId].quantityProducts += productsQuantity;
            acc[clientId].totalAmount += item.total;
          });
          return acc;
        },
        {} as { [key: string]: ClientStatistics },
      );

      const result: ClientStatistics[] = Object.values(summary);

      return result
        .filter((item) => item.name !== 'PARTICULAR')
        .sort((a, b) => b.quantityPurchases - a.quantityPurchases);
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async getGeneralStatistics(
    timeRange?: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<GeneralStatistics> {
    try {
      const filterCondition = this.getCondition(timeRange, startDate, endDate);
      const sales = await this.prisma.sale.findMany({
        where: filterCondition,
        include: {
          saleDetail: true,
        },
      });

      const summary: GeneralStatistics = sales.reduce(
        (acc, sale) => {
          acc.salesQuantity++;
          acc.incomesTotal += sale.total;
          acc.productsSold += sale.saleDetail.reduce(
            (sum, detail) => sum + detail.quantity,
            0,
          );

          return acc;
        },
        {
          salesQuantity: 0,
          incomesTotal: 0,
          productsSold: 0,
        } as GeneralStatistics,
      );

      return summary;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  private getTimeRange(timeRange?: string): Date {
    const limitedDate = new Date();
    switch (timeRange) {
      case '7days':
        limitedDate.setDate(limitedDate.getDate() - 7);
        break;
      case '30days':
        limitedDate.setMonth(limitedDate.getMonth() - 1);
        break;
      case '1year':
        limitedDate.setFullYear(limitedDate.getFullYear() - 1);
        break;
      default:
        limitedDate.setFullYear(limitedDate.getFullYear() - 10);
        break;
    }
    return limitedDate;
  }

  private getCondition(timeRange?: string, startDate?: Date, endDate?: Date) {
    let filterCondition: any = {};

    if (startDate && endDate) {
      filterCondition = {
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      };
    } else {
      const startRangeDate = this.getTimeRange(timeRange);
      filterCondition = {
        date: {
          gte: startRangeDate,
        },
      };
    }
    return filterCondition;
  }
}
