import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Sale, SaleDetail } from '@prisma/client';
import { SaleExtended, SaleToCreate } from 'src/types/sale.types';

import { PrismaService } from 'src/prisma/prisma.service';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class SalesService {
  constructor(
    private prisma: PrismaService,
    private productsService: ProductsService,
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
          client: true,
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
      const sale = await this.prisma.sale.create({ data: payload.data });

      let noStockAvailable: boolean;
      let i = 0;
      while (!noStockAvailable && i < payload.items.length) {
        const product = payload.items[i];
        const productDetail = await this.productsService.getOne({
          id: product.id,
        });
        if (productDetail.data.stock < product.quantity)
          noStockAvailable = true;
        else {
          await this.prisma.saleDetail.create({
            data: {
              quantity: product.quantity,
              product_id: product.id,
              sale_id: sale.id,
            },
          });
          await this.productsService.update({
            ...productDetail.data,
            stock: productDetail.data.stock - product.quantity,
          });

          i++;
        }
      }
      if (noStockAvailable) {
        for (const product of payload.items) {
          const productDetail = await this.productsService.getOne({
            id: product.id,
          });
          if (productDetail.data.stock > product.quantity)
            await this.productsService.update({
              ...productDetail.data,
              stock: productDetail.data.stock + product.quantity,
            });
        }
        await this.prisma.saleDetail.deleteMany({
          where: {
            sale_id: sale.id,
          },
        });
        await this.prisma.sale.delete({
          where: {
            id: sale.id,
          },
        });
        throw new BadRequestException(
          'No hay suficiente stock de los productos seleccionados.',
        );
      }

      return sale;
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
      await this.prisma.saleDetail.deleteMany({
        where: {
          sale_id: id,
        },
      });
      return await this.prisma.sale.delete({
        where: {
          id,
        },
      });
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
