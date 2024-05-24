import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Sale, SaleDetail } from '@prisma/client';
import { SaleExtended, SaleToCreate } from 'src/types/sale.types';

import { ClientsService } from 'src/clients/clients.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductsService } from 'src/products/products.service';
import { TransactionService } from 'src/transaction/transaction.service';

@Injectable()
export class SalesService {
  constructor(
    private prisma: PrismaService,
    private productsService: ProductsService,
    private transactionService: TransactionService,
    private clientsService: ClientsService,
  ) {}
  private readonly logger = new Logger('SalesService');

  async getAll(): Promise<Sale[]> {
    try {
      return await this.prisma.sale.findMany({
        include: {
          client: true,
        },
        orderBy: {
          date: 'desc',
        },
      });
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async getLastWeek(): Promise<Sale[]> {
    const currentDate = new Date();

    const lastWeekStartDate = new Date(currentDate);
    lastWeekStartDate.setDate(currentDate.getDate() - 7);

    const lastWeekEndDate = new Date(currentDate);

    return await this.prisma.sale.findMany({
      where: {
        date: {
          gte: lastWeekStartDate,
          lte: lastWeekEndDate,
        },
      },
      include: {
        client: true,
      },
      orderBy: {
        date: 'desc',
      },
    });
  }

  async getOne(sale: SaleExtended): Promise<Sale> {
    try {
      const dbSale = await this.prisma.sale.findFirst({
        where: sale,
        include: {
          client: {
            include: {
              address: true,
            },
          },
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
      if (!dbSale) throw new NotFoundException('La venta no fue encontrada.');

      return dbSale;
    } catch (error) {
      throw error;
    }
  }

  async create(payload: SaleToCreate): Promise<Sale> {
    try {
      const stockAvailable = await this.productsService.verifyStocks({
        items: payload.items,
      });
      if (!stockAvailable)
        throw new BadRequestException(
          'No hay suficiente stock de los productos seleccionados.',
        );

      const sale = await this.prisma.sale.create({
        data: { ...payload.data },
      });
      for (const i of payload.items) {
        const product = await this.productsService.getOne({ id: i.id });
        await this.prisma.saleDetail.create({
          data: {
            quantity: i.quantity,
            product_id: i.id,
            sale_id: sale.id,
          },
        });
        await this.productsService.update({
          id: product.id,
          name: product.name,
          stock: product.stock - i.quantity,
          type_id: product.type_id,
          image: product.image,

          materialRecipe: undefined,
        });
      }

      return sale;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async changeStatusPaid(id: string): Promise<Sale> {
    try {
      const sale = await this.prisma.sale.findFirst({
        where: { id },
      });
      if (!sale) throw new NotFoundException('La venta no fue encontrada.');
      if (sale.paid) {
        await this.transactionService.deleteByParent(sale.id);
        return await this.prisma.sale.update({
          where: { id },
          data: { paid: !sale.paid },
        });
      } else {
        const client = await this.clientsService.getOne({ id: sale.client_id });
        await this.transactionService.create({
          date: sale.date,
          name: client.name,
          value: sale.total,
          parent_id: sale.id,
          type: 'Variable',

          id: undefined,
        });
      }
      return await this.prisma.sale.update({
        where: { id },
        data: { paid: !sale.paid },
      });
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async changeStatusDelivered(id: string): Promise<Sale> {
    try {
      const sale = await this.prisma.sale.findFirst({
        where: { id },
      });
      if (!sale) throw new NotFoundException('La venta no fue encontrada.');
      return await this.prisma.sale.update({
        where: { id },
        data: { delivered: !sale.delivered },
      });
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async update(data: Sale): Promise<Sale> {
    try {
      return await this.prisma.sale.update({ where: { id: data.id }, data });
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async updateDetail(data: SaleDetail): Promise<SaleDetail> {
    try {
      return await this.prisma.saleDetail.update({
        where: { id: data.id },
        data,
      });
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async delete(id: string): Promise<Sale> {
    try {
      const details = await this.prisma.saleDetail.findMany({
        where: { sale_id: id },
      });
      for (const detail of details) {
        await this.productsService.updateStock({
          id: detail.product_id,
          stock: detail.quantity,
        });
      }
      await this.prisma.saleDetail.deleteMany({ where: { sale_id: id } });
      return await this.prisma.sale.delete({ where: { id } });
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async deleteDetail(id: string): Promise<SaleDetail> {
    try {
      return await this.prisma.saleDetail.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }
}
