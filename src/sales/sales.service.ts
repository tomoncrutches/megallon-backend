import { Sale, SaleDetail } from '@prisma/client';

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SaleExtended } from 'src/types/sale.types';

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    try {
      const sales = await this.prisma.sale.findMany();
      const salesDetails = await this.prisma.saleDetail.findMany();

      return sales.map((sale) => {
        return {
          ...sale,
          items: salesDetails.filter(
            (saleDetail) => saleDetail.sale_id === sale.id,
          ),
        };
      });
    } catch (error) {
      console.error(
        'An error has ocurred while fetching sales: ',
        error.message,
      );
      throw new Error(
        `An error has ocurred white fetching sales: ${error.message}`,
      );
    }
  }

  async create(payload: SaleExtended) {
    try {
      const sale = await this.prisma.sale.create({ data: payload.data });
      for (const product of payload.items) {
        await this.prisma.saleDetail.create({
          data: {
            quantity: product.quantity,
            product_id: product.id,
            sale_id: sale.id,
          },
        });
      }
    } catch (error) {
      console.error(
        'An error has ocurred while creating sale: ',
        error.message,
      );
      throw new Error(
        `An error has ocurred white creating sale: ${error.message}`,
      );
    }
  }

  async update(id: string, data: Sale) {
    try {
      await this.prisma.sale.update({ where: { id }, data });
    } catch (error) {
      console.error(
        'An error has ocurred while updating sale: ',
        error.message,
      );
      throw new Error(
        `An error has ocurred while updating sale: ${error.message}`,
      );
    }
  }

  async updateDetail(id: string, data: SaleDetail) {
    try {
      await this.prisma.saleDetail.update({ where: { id }, data });
    } catch (error) {
      console.error(
        'An error has ocurred while updating sale: ',
        error.message,
      );
      throw new Error(
        `An error has ocurred while updating sale: ${error.message}`,
      );
    }
  }

  async delete(id: string) {
    try {
      await this.prisma.sale.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      console.error(
        'An error has ocurred while deleting sale: ',
        error.message,
      );
      throw new Error(
        `An error has ocurred while deleting sale: ${error.message}`,
      );
    }
  }

  async deleteDetail(id: string) {
    try {
      await this.prisma.saleDetail.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      console.error(
        'An error has ocurred while deleting sale: ',
        error.message,
      );
      throw new Error(
        `An error has ocurred while deleting sale: ${error.message}`,
      );
    }
  }
}
