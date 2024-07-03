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

  async getProductsSold(timeRange: string): Promise<ProductStatistics[]> {
    try {
      const startDate = this.getTimeRange(timeRange);
      const sales = await this.prisma.sale.findMany({
        where: {
          date: {
            gte: startDate,
          },
        },
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

      // CODIGO ANTERIOR

      // const sales = await this.prisma.sale.findMany({
      //   where: {
      //     date: {
      //       gte: startDate,
      //     },
      //   },
      // });
      // const ProductStatistics: ProductStatistics[] = [];
      // for (const sale of sales) {
      //   const saleDetail = await this.prisma.saleDetail.findMany({
      //     where: {
      //       sale_id: sale.id,
      //     },
      //     include: {
      //       product: {
      //         include: {
      //           type: true,
      //         },
      //       },
      //     },
      //   });

      //   for (const item of saleDetail) {
      //     const productIndex = ProductStatistics.findIndex(
      //       (product) => product.name === item.product.name,
      //     );
      //     if (productIndex === -1) {
      //       ProductStatistics.push({
      //         name: item.product.name,
      //         quantitySold: item.quantity,
      //         totalAmount: item.quantity * item.product.type.price,
      //       });
      //     } else {
      //       ProductStatistics[productIndex].quantitySold += item.quantity;
      //       ProductStatistics[productIndex].totalAmount +=
      //         item.quantity * item.product.type.price;
      //     }
      //   }
      // }

      // return ProductStatistics.sort((a, b) => b.quantitySold - a.quantitySold);
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async getClientsPurchases(timeRange: string): Promise<ClientStatistics[]> {
    try {
      const startDate = this.getTimeRange(timeRange);
      const clients = await this.prisma.client.findMany({
        include: {
          sale: {
            where: {
              date: {
                gte: startDate,
              },
            },
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

      // CODIGO ANTERIOR
      // const sales = await this.prisma.sale.findMany({
      //   where: {
      //     date: {
      //       gte: startDate,
      //     },
      //   },
      //   include: {
      //     client: true,
      //   },
      // });
      // const clientsStatistics: ClientStatistics[] = [];
      // for (const sale of sales) {
      //   const saleDetail = await this.prisma.saleDetail.findMany({
      //     where: {
      //       sale_id: sale.id,
      //     },
      //   });
      //   let clientIndex = clientsStatistics.findIndex(
      //     (client) => client.name === sale.client.name,
      //   );
      //   for (const item of saleDetail) {
      //     if (clientIndex === -1) {
      //       clientsStatistics.push({
      //         name: sale.client.name,
      //         quantityPurchases: 0,
      //         quantityProducts: item.quantity,
      //         totalAmount: 0,
      //       });
      //       clientIndex = clientsStatistics.length - 1;
      //     } else {
      //       clientsStatistics[clientIndex].quantityProducts += item.quantity;
      //     }
      //   }
      //   clientsStatistics[clientIndex].totalAmount += sale.total;
      //   clientsStatistics[clientIndex].quantityPurchases += 1;
      // }
      // const filteredClientsStatistics = clientsStatistics.filter(
      //   (client) => client.name !== 'PARTICULAR',
      // );

      // return filteredClientsStatistics.sort(
      //   (a, b) => b.quantityPurchases - a.quantityPurchases,
      // );
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async getGeneralStatistics(timeRange: string): Promise<GeneralStatistics> {
    try {
      const startDate = this.getTimeRange(timeRange);
      const sales = await this.prisma.sale.findMany({
        where: {
          date: {
            gte: startDate,
          },
        },
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

      // CODIGO ANTERIOR

      // const generalStatistics = {
      //   salesQuantity: 0,
      //   incomesTotal: 0,
      //   productsSold: 0,
      // };

      // const sales = await this.prisma.sale.findMany({
      //   where: {
      //     date: {
      //       gte: startDate,
      //     },
      //   },
      // });
      // for (const sale of sales) {
      //   generalStatistics.salesQuantity += 1;
      //   generalStatistics.incomesTotal += sale.total;
      //   const saleDetail = await this.prisma.saleDetail.findMany({
      //     where: {
      //       sale_id: sale.id,
      //     },
      //   });
      //   for (const item of saleDetail) {
      //     generalStatistics.productsSold += item.quantity;
      //   }
      // }
      // return generalStatistics;
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
