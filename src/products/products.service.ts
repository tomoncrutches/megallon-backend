import { Injectable, Logger } from '@nestjs/common';
import { Product } from '@prisma/client';
import { ProductComplete } from 'src/types/product.types';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}
  private readonly logger = new Logger('Product Service');
  async create(data: Product) {
    // The create method is used to create a new record in the database
    try {
      return await this.prisma.product.create({ data });
    } catch (error) {
      console.error(`Error in create: ${error.message}`);
      throw new Error('Error creating data in the database');
    }
  }

  async getAll() {
    // The findMany method is used to retrieve all records from the database
    try {
      const products = await this.prisma.product.findMany();
      const productsComplete: ProductComplete[] = [];
      for (const product of products) {
        const type = this.getType(product.type_id);
        const productComplete: ProductComplete = {
          data: product,
          type: await type,
        };
        productsComplete.push(productComplete);
      }
      this.logger.log(productsComplete); // Utiliza el servicio de registro en lugar de console.log
      return productsComplete;
    } catch (error) {
      console.error(`Error in getAll: ${error.message}`);
      throw new Error('Error retrieving data from the database');
    }
  }

  async getOne(index: object) {
    // The findFirst method is used to retrieve a single record from the database
    try {
      const product = await this.prisma.product.findFirst({ where: index });
      if (!product) {
        throw new Error('Product not found');
      } else {
        const type = this.getType(product.type_id);
        const productComplete: ProductComplete = {
          data: product,
          type: await type,
        };
        return productComplete;
      }
    } catch (error) {
      console.error(`Error in getOne: ${error.message}`);
      throw new Error('Error retrieving data from the database');
    }
  }

  async getType(typeId: string) {
    try {
      const type = await this.prisma.productType.findFirst({
        where: { id: typeId },
      });
      return type;
    } catch (error) {
      console.error(`Error in getType: ${error.message}`);
      throw new Error('Error retrieving data from the database');
    }
  }

  async update(data: Product) {
    try {
      return await this.prisma.product.update({
        where: {
          id: data.id,
        },
        data,
      });
    } catch (error) {
      console.error(
        'An error has ocurred while updating product: ',
        error.message,
      );
      throw new Error(
        `An error has ocurred while updating product: ${error.message}`,
      );
    }
  }

  async delete(id: string) {
    try {
      return await this.prisma.product.delete({ where: { id } });
    } catch (error) {
      console.error(`Error in delete: ${error.message}`);
      throw new Error('Error deleting data from the database');
    }
  }

  async addProduction(list: Product[]) {
    try {
      list.forEach((element) => {
        this.update(element);
      });
    } catch (error) {
      console.error(`Error in addProduction: ${error.message}`);
      throw new Error('Error adding production data in the database');
    }
  }
}
