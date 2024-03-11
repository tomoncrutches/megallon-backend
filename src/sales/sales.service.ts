import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Product, Sale, SaleDetail } from '@prisma/client';
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

  async getAll(): Promise<SaleExtended[]> {
    try {
      const sales = await this.prisma.sale.findMany();
      const salesDetails = await this.prisma.saleDetail.findMany();

      const extendedSales = sales.map((sale) => {
        return {
          ...sale,
          items: salesDetails.filter(
            (saleDetail) => saleDetail.sale_id === sale.id,
          ),
        };
      });
      const finallySales: SaleExtended[] = [];

      for (const sale of extendedSales) {
        const items = await Promise.all(
          sale.items.map((item) => {
            return new Promise(async (resolve) => {
              const product = await this.productsService.getOne({
                id: item.product_id,
              });
              resolve({
                id: item.id,
                quantity: item.quantity,
                ...product,
              });
            });
          }),
        );
        finallySales.push({
          data: {
            id: sale.id,
            date: sale.date,
            total: sale.total,
            client_id: sale.client_id,
          },
          items: items as Product[],
        });
      }
      return finallySales;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async create(payload: SaleToCreate): Promise<Sale> {
    try {
      const sale = await this.prisma.sale.create({ data: payload.data });
      for (const product of payload.items) {
        const productDetail = await this.productsService.getOne({
          id: product.id,
        });
        if (productDetail.data.stock < product.quantity)
          throw new BadRequestException(
            'The selected quantity is not available.',
          );

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
