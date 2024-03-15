import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { Material } from '@prisma/client';
import { OptionalMaterial } from 'src/types/material.types';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MaterialService {
  constructor(private prisma: PrismaService) {}
  private readonly logger = new Logger('MaterialService');

  async create(data: Material): Promise<Material> {
    try {
      return await this.prisma.material.create({ data });
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async getAll(): Promise<Material[]> {
    try {
      return await this.prisma.material.findMany();
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async getOne(material: OptionalMaterial): Promise<Material> {
    try {
      const dbMaterial = await this.prisma.material.findFirst({
        where: material,
      });
      if (!dbMaterial) throw new NotFoundException('Material not found.');

      return dbMaterial;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async update(data: Material): Promise<Material> {
    try {
      return await this.prisma.material.update({
        where: {
          id: data.id,
        },
        data,
      });
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async delete(id: string): Promise<Material> {
    try {
      return await this.prisma.material.delete({ where: { id } });
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }
}
