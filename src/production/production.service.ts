import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Production, ProductionDetail } from '@prisma/client';

import { OptionalProduction } from 'src/types/productions.types';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductionComplete } from 'src/types/productions.types';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class ProductionService {
  constructor(
    private prisma: PrismaService,
    private productsService: ProductsService,
  ) {}
  private readonly logger = new Logger('Production Service');

  async create(
    data: Production,
    details: ProductionDetail[] /* The create method is used to create a new record in the database.
  The updateProductStock method is used to update the stock of a product in the database.
  Parameters:
  - data: The data of Production to be created in the database.
  - details: List of ProductionDetail to be created in the database.(this data is used to update the stock of the product in the database.)
  */,
  ): Promise<Production> {
    try {
      for (const element of details) {
        this.updateProductStock(element['product_Id'], element['quantity']);
        this.prisma.productionDetail.create({ data: element });
      }
      return await this.prisma.production.create({ data });
    } catch (error) {
      this.logger.error(`Error in create: ${error.message}`);
      throw error;
    }
  }

  private async updateProductStock(productId: string, quantity: number) {
    try {
      const product = await this.productsService.getOne({ id: productId });
      product['stock'] += quantity;
      await this.productsService.update(product);
    } catch (error) {
      this.logger.error(`Error in updateProductStock: ${error.message}`);
      throw error;
    }
  }

  async getAll(): Promise<ProductionComplete[]> {
    try {
      const productions = await this.prisma.production.findMany();
      const productionCompleteList: ProductionComplete[] = [];
      for (const production of productions) {
        const item: ProductionComplete = await this.getOne({
          id: production['id'],
        });
        productionCompleteList.push(item);
      }
      return productionCompleteList;
    } catch (error) {
      this.logger.error(`Error in getAll: ${error.message}`);
      throw error;
    }
  }

  async getOne(production: OptionalProduction): Promise<ProductionComplete> {
    try {
      let dbProduction: ProductionComplete;
      dbProduction['data'] = await this.prisma.production.findFirst({
        where: production,
      });
      if (!dbProduction['data']) {
        throw new NotFoundException('Production not found');
      }
      dbProduction['details'] = await this.prisma.productionDetail.findMany({
        where: production,
      });
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
