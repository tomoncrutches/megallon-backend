import {
  ClientStatistics,
  ProductsStatistics,
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

  async getProductsSold(timeRange: string): Promise<ProductsStatistics[]> {
    try {
      const startDate = this.getTimeRange(timeRange);
      const sales = await this.prisma.sale.findMany({
        where: {
          date: {
            gte: startDate,
          },
        },
      });
      const productsStatistics: ProductsStatistics[] = [];
      for (const sale of sales) {
        const saleDetail = await this.prisma.saleDetail.findMany({
          where: {
            sale_id: sale.id,
          },
          include: {
            product: {
              include: {
                type: true,
              },
            },
          },
        });

        for (const item of saleDetail) {
          const productIndex = productsStatistics.findIndex(
            (product) => product.name === item.product.name,
          );
          if (productIndex === -1) {
            productsStatistics.push({
              name: item.product.name,
              quantitySold: item.quantity,
              totalAmount: item.quantity * item.product.type.price,
            });
          } else {
            productsStatistics[productIndex].quantitySold += item.quantity;
            productsStatistics[productIndex].totalAmount +=
              item.quantity * item.product.type.price;
          }
        }
      }

      return productsStatistics.sort((a, b) => b.quantitySold - a.quantitySold);
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async getClientsPurchases(timeRange: string): Promise<ClientStatistics[]> {
    try {
      const startDate = this.getTimeRange(timeRange);
      const sales = await this.prisma.sale.findMany({
        where: {
          date: {
            gte: startDate,
          },
        },
        include: {
          client: true,
        },
      });
      const clientsStatistics: ClientStatistics[] = [];
      for (const sale of sales) {
        const saleDetail = await this.prisma.saleDetail.findMany({
          where: {
            sale_id: sale.id,
          },
        });
        let clientIndex = clientsStatistics.findIndex(
          (client) => client.name === sale.client.name,
        );
        for (const item of saleDetail) {
          if (clientIndex === -1) {
            clientsStatistics.push({
              name: sale.client.name,
              quantityPurchases: 0,
              quantityProducts: item.quantity,
              totalAmount: 0,
            });
            clientIndex = clientsStatistics.length - 1;
          } else {
            clientsStatistics[clientIndex].quantityProducts += item.quantity;
          }
        }
        clientsStatistics[clientIndex].totalAmount += sale.total;
        clientsStatistics[clientIndex].quantityPurchases += 1;
      }
      const filteredClientsStatistics = clientsStatistics.filter(
        (client) => client.name !== 'PARTICULAR',
      );

      return filteredClientsStatistics.sort(
        (a, b) => b.quantityPurchases - a.quantityPurchases,
      );
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  private getTimeRange(timeRange: string): Date {
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
}
