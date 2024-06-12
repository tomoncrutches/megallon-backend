import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { MaterialForBuy, OptionalMaterial } from 'src/types/material.types';

import { Material } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { TransactionService } from 'src/transaction/transaction.service';

const etiquetaSabor = {
  NOA: '7ff29ac5-e9e1-4563-92cf-ac5afccdd8bd',
  'NOA S/SAL': '6b6c9711-fdcd-4230-b4cb-5d1ce12f1df3',
  Arvejas: '13993496-f3be-4b48-b0a4-a01486dd3c65',
  Lentejas: 'cf782a6b-8b36-4822-91d3-69392b1352b2',
  Carbonada: 'b008911d-79e1-4bdf-afad-7f84b81dd57b',
  'Risotto de Hongos': '98f5a47f-8e98-43b1-9c77-2b16401a3638',
  Mediterráneo: 'fd162326-2b87-4236-bd29-667b484cf798',
  'Poroto Aduki': 'b15f09e8-7dea-4fa6-9a47-f913337a4483',
  Bruselas: 'e771f06e-a7d5-41a5-b89f-71593f2a523f',
};
@Injectable()
export class MaterialService {
  constructor(
    private prisma: PrismaService,
    private transactionService: TransactionService,
  ) {}
  private readonly logger = new Logger('MaterialService');

  async create(data: Material): Promise<Material> {
    try {
      // Check if a material with the same name already exists
      const existingMaterial = await this.prisma.material.findFirst({
        where: { name: data.name },
      });

      if (existingMaterial) {
        throw new ConflictException(
          'Un material con el mismo nombre ya existe.',
        );
      }

      // If not, proceed to create the new material
      return await this.prisma.material.create({ data });
    } catch (error) {
      this.logger.error(`Error in create: ${error.message}`);
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
      if (!dbMaterial)
        throw new NotFoundException('El material no fue encontrado.');

      return dbMaterial;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async buyMaterial(data: MaterialForBuy): Promise<Material> {
    try {
      const material = await this.prisma.material.findFirst({
        where: { id: data.id },
      });
      if (!material)
        throw new NotFoundException('El material no fue encontrado.');
      await this.transactionService.create({
        name: material.name,
        value: -(data.price * (data.quantity / 1000)),
        parent_id: data.id,
        type: 'Variable',
        date: new Date(),
        id: undefined,
      });
      return await this.prisma.material.update({
        where: {
          id: data.id,
        },
        data: {
          actual_price: data.price,
          stock: {
            increment: data.quantity,
          },
        },
      });
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

  async consumePackaging(quantity, name): Promise<void> {
    try {
      //Descuento de separadores por paquete
      await this.prisma.material.update({
        where: { id: '43cdd4e0-9d3b-4bde-8469-530a6bc1bff9' },
        data: { stock: { decrement: quantity * 4 } },
      });
      //Descuento bolsa por paquete
      await this.prisma.material.update({
        where: { id: 'e167f44a-ebd1-4bac-9dbd-8b505449b99f' },
        data: { stock: { decrement: quantity } },
      });
      //etiqueta por paquete
      await this.prisma.material.update({
        where: { id: etiquetaSabor[name] },
        data: { stock: { decrement: quantity } },
      });
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }
}
