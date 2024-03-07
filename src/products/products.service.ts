import { Injectable } from '@nestjs/common';
import { Product } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

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
      return await this.prisma.product.findMany();
    } catch (error) {
      console.error(`Error in getAll: ${error.message}`);
      throw new Error('Error retrieving data from the database');
    }
  }

  async getOne(index: object) {
    // The findFirst method is used to retrieve a single record from the database
    try {
      return await this.prisma.product.findFirst({ where: index });
    } catch (error) {
      console.error(`Error in getOne: ${error.message}`);
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
