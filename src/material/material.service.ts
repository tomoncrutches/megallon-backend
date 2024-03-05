import { Injectable } from '@nestjs/common';
import { Material } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MaterialService {
  constructor(private prisma: PrismaService) {}

  async create(data: Material) {
    try {
      return this.prisma.material.create({ data });
    } catch (error) {
      console.error('An error has ocurred while creating data: ', error);
      throw new Error(`An error has ocurred while creating data: ${error}`);
    }
  }

  async getAll() {
    try {
      return this.prisma.material.findMany();
    } catch (error) {
      console.error('An error has ocurred while fetching data: ', error);
      throw new Error(`An error has ocurred while fetching data: ${error}`);
    }
  }

  async getOne(index: object) {
    try {
      return this.prisma.material.findFirst({ where: index });
    } catch (error) {
      console.error('An error has ocurred while fetching data detail: ', error);
      throw new Error(
        `An error has ocurred while fetching data detail: ${error}`,
      );
    }
  }

  async update(id: string, data: Material) {
    try {
      return this.prisma.material.update({
        where: {
          id,
        },
        data,
      });
    } catch (error) {
      console.error('An error has ocurred while updating material: ', error);
      throw new Error(`An error has ocurred while updating material: ${error}`);
    }
  }

  async delete(id: string) {
    try {
      return this.prisma.material.delete({ where: { id } });
    } catch (error) {
      console.error('An error has ocurred white deleting material: ', error);
      throw new Error(`An error has ocurred white deleting material: ${error}`);
    }
  }
}
