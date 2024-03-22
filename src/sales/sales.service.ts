import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Sale, SaleDetail } from '@prisma/client';
import { SaleComplete, SaleExtended, SaleToCreate } from 'src/types/sale.types';

import { ClientsService } from 'src/clients/clients.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductComplete } from 'src/types/product.types';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class SalesService {
  constructor(
    private prisma: PrismaService,
    private productsService: ProductsService,
    private clientsService: ClientsService,
  ) {}
  private readonly logger = new Logger('SalesService');

  async getAll(): Promise<SaleExtended[]> {
    try {
      const sales = await this.prisma.sale.findMany();
      const extendedSales = await Promise.all(
        sales.map((sale) => {
          return new Promise(async (resolve) => {
            const client = await this.clientsService.getOne({
              id: sale.client_id,
            });
            resolve({
              ...sale,
              client_id: undefined,
              client,
            } as SaleExtended);
          });
        }),
      );
      return extendedSales as SaleExtended[];
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async getOne(sale: SaleExtended): Promise<SaleComplete> {
    try {
      const dbSale = await this.prisma.sale.findFirst({ where: sale });
      if (!dbSale) throw new NotFoundException("Sale doesn't found.");

      const client = await this.clientsService.getOne({
        id: dbSale.client_id,
      });
      const details = await this.prisma.saleDetail.findMany({
        where: { sale_id: dbSale.id },
      });
      if (details.length === 0)
        throw new NotFoundException("Details doesn't found.");

      const productDetails = await Promise.all(
        details.map((detail) => {
          return new Promise(async (resolve) => {
            const product = await this.productsService.getOne({
              id: detail.product_id,
            });
            const { data, type } = product;
            resolve({
              quantity: detail.quantity,
              ...data,
              type,
              type_id: undefined,
            });
          });
        }),
      );
      return {
        ...dbSale,
        client_id: undefined,
        client,
        items: productDetails as ProductComplete[],
      };
    } catch (error) {
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
        if (productDetail.data.stock < product.quantity) {
          await this.prisma.sale.delete({
            where: {
              id: sale.id,
            },
          });
          throw new BadRequestException(
            'The selected quantity is not available.',
          );
        }
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
