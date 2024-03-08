import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Production, ProductionDetail } from '@prisma/client';
import { ProductsService } from 'src/products/products.service';
import { ProductionComplete } from 'src/types/productions.types';

@Injectable()
export class ProductionService {
  constructor(
    private prisma: PrismaService,
    private productsService: ProductsService,
  ) {}

  async create(
    data: Production,
    details: ProductionDetail[] /* The create method is used to create a new record in the database.
  The updateProductStock method is used to update the stock of a product in the database.
  Parameters:
  - data: The data of Production to be created in the database.
  - details: List of ProductionDetail to be created in the database.(this data is used to update the stock of the product in the database.)
  */,
  ) {
    try {
      for (const element of details) {
        this.updateProductStock(element['product_Id'], element['quantity']);
        this.prisma.productionDetail.create({ data: element });
      }
      return await this.prisma.production.create({ data });
    } catch (error) {
      console.error(`Error in create: ${error.message}`);
      throw new Error('Error creating data in the database');
    }
  }

  private async updateProductStock(productId: string, quantity: number) {
    try {
      const product = await this.productsService.getOne({ id: productId });
      product['stock'] += quantity;
      await this.productsService.update(product.data);
    } catch (error) {
      console.error(`Error updating product stock: ${error.message}`);
      throw new Error('Error updating product stock');
    }
  }

  async getAll() {
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
      console.error(`Error in getAll: ${error.message}`);
      throw new Error('Error retrieving data from the database');
    }
  }

  async getOne(index: object) {
    try {
      let production: ProductionComplete;
      production['data'] = await this.prisma.production.findFirst({
        where: index,
      });
      production['details'] = await this.prisma.productionDetail.findMany({
        where: index,
      });
      return production;
    } catch (error) {
      console.error(`Error in getOne: ${error.message}`);
      throw new Error('Error retrieving data from the database');
    }
  }

  async update(data: Production) {
    try {
      return await this.prisma.production.update({
        where: {
          id: data.id,
        },
        data,
      });
    } catch (error) {
      console.error(
        'An error has ocurred while updating production: ',
        error.message,
      );
      throw new Error(
        `An error has ocurred while updating production: ${error.message}`,
      );
    }
  }

  async updateProductionDetails(data: ProductionDetail) {
    try {
      return await this.prisma.productionDetail.update({
        where: {
          id: data.id,
        },
        data,
      });
    } catch (error) {
      console.error(
        'An error has ocurred while updating production detail: ',
        error.message,
      );
      throw new Error(
        `An error has ocurred while updating production detail: ${error.message}`,
      );
    }
  }

  async delete(id: string) {
    try {
      await this.prisma.productionDetail.deleteMany({ where: { id } });
      return await this.prisma.production.delete({ where: { id } });
    } catch (error) {
      console.error(`Error in delete: ${error.message}`);
      throw new Error('Error deleting data from the database');
    }
  }

  async deleteProductionDetail(id: string) {
    try {
      return await this.prisma.productionDetail.delete({ where: { id } });
    } catch (error) {
      console.error(`Error in delete: ${error.message}`);
      throw new Error('Error deleting data from the database');
    }
  }
}
