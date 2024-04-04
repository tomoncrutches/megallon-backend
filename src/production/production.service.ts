import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  OptionalProduction,
  ProductionForCreate,
} from 'src/types/productions.types';
import { Production, ProductionDetail } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class ProductionService {
  constructor(
    private prisma: PrismaService,
    private productsService: ProductsService,
  ) {}
  private readonly logger = new Logger('Production Service');

  async create(
    data: ProductionForCreate /* The create method is used to create a new record in the database.
  The updateProductStock method is used to update the stock of a product in the database.
  Parameters:
  - data: The data of Production to be created in the database.
  - details: List of ProductionDetail to be created in the database.(this data is used to update the stock of the product in the database.)
  */,
  ): Promise<Production> {
    try {
      const productionCreated = await this.prisma.production.create({
        data: {
          date: data.date,
          hours: data.hours,
          personal_quantity: data.personal_quantity,
        },
      });
      for (const element of data.products) {
        await this.updateProductStock(element.id, element.quantity);
        await this.prisma.productionDetail.create({
          data: {
            production_id: productionCreated.id,
            product_id: element.id,
            quantity: element.quantity,
          },
        });
      }
      return productionCreated;
    } catch (error) {
      this.logger.error(`Error in create: ${error.message}`);
      throw error;
    }
  }

  private async updateProductStock(productId: string, quantity: number) {
    try {
      await this.prisma.product.update({
        where: { id: productId },
        data: { stock: { increment: quantity } },
      });
    } catch (error) {
      this.logger.error(`Error in updateProductStock: ${error.message}`);
      throw error;
    }
  }

  async getAll(): Promise<Production[]> {
    try {
      const productions = await this.prisma.production.findMany({
        include: {
          ProductionDetail: {
            include: { product: true },
          },
        },
      });
      return productions;
    } catch (error) {
      this.logger.error(`Error in getAll: ${error.message}`);
      throw error;
    }
  }

  async getOne(production: OptionalProduction): Promise<Production> {
    try {
      const dbProduction = await this.prisma.production.findFirst({
        where: production,
        include: {
          ProductionDetail: {
            include: { product: true },
          },
        },
      });
      if (!dbProduction) {
        throw new NotFoundException('Producción no encontrada.');
      }
      return dbProduction;
    } catch (error) {
      this.logger.error(`Error in getOne: ${error.message}`);
      throw error;
    }
  }

  async update(data: Production): Promise<Production> {
    try {
      return await this.prisma.production.update({
        where: {
          id: data.id,
        },
        data,
      });
    } catch (error) {
      this.logger.error(`Error in update: ${error.message}`);
      throw error;
    }
  }

  async updateProductionDetails(
    data: ProductionDetail,
  ): Promise<ProductionDetail> {
    try {
      return await this.prisma.productionDetail.update({
        where: {
          id: data.id,
        },
        data,
      });
    } catch (error) {
      this.logger.error(`Error in updateProductionDetails: ${error.message}`);
      throw error;
    }
  }

  async delete(id: string): Promise<Production> {
    try {
      await this.prisma.productionDetail.deleteMany({
        where: { production_id: id },
      });
      return await this.prisma.production.delete({ where: { id } });
    } catch (error) {
      this.logger.error(`Error in delete: ${error.message}`);
      throw error;
    }
  }

  async deleteProductionDetail(id: string): Promise<ProductionDetail> {
    try {
      return await this.prisma.productionDetail.delete({ where: { id } });
    } catch (error) {
      this.logger.error(`Error in deleteProductionDetail: ${error.message}`);
      throw error;
    }
  }
}
