import { Injectable } from '@nestjs/common';
import { Material } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MaterialService {
  constructor(private prisma: PrismaService) {}

  async create(data: Material) {
    try {
      return await this.prisma.material.create({ data });
    } catch (error) {
      console.error(
        'An error has ocurred while creating data: ',
        error.message,
      );
      throw new Error(
        `An error has ocurred while creating data: ${error.message}`,
      );
    }
  }

  async getAll() {
    try {
      return await this.prisma.material.findMany();
    } catch (error) {
      console.error(
        'An error has ocurred while fetching data: ',
        error.message,
      );
      throw new Error(
        `An error has ocurred while fetching data: ${error.message}`,
      );
    }
  }

  async getOne(index: object) {
    try {
      return await this.prisma.material.findFirst({ where: index });
    } catch (error) {
      console.error(
        'An error has ocurred while fetching data detail: ',
        error.message,
      );
      throw new Error(
        `An error has ocurred while fetching data detail: ${error.message}`,
      );
    }
  }

  async update(data: Material) {
    try {
      return await this.prisma.material.update({
        where: {
          id: data.id,
        },
        data,
      });
    } catch (error) {
      console.error(
        'An error has ocurred while updating material: ',
        error.message,
      );
      throw new Error(
        `An error has ocurred while updating material: ${error.message}`,
      );
    }
  }

  async delete(id: string) {
    try {
      return await this.prisma.material.delete({ where: { id } });
    } catch (error) {
      console.error(
        'An error has ocurred white deleting material: ',
        error.message,
      );
      throw new Error(
        `An error has ocurred white deleting material: ${error.message}`,
      );
    }
  }
}
