import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { MaterialForBuy, OptionalMaterial } from 'src/types/material.types';

import { Material } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { StaticMaterialId } from 'src/const/static-materials-id.enum';
import { TransactionService } from 'src/transaction/transaction.service';

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
        value: material.type === 'Limpieza' ?  -(data.price * data.quantity) : -(data.price * (data.quantity / 1000)) ,
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

  async consumePackaging(quantity: number, name: string): Promise<void> {
    try {
      //Descuento de separadores por paquete
      await this.prisma.material.update({
        where: { id: StaticMaterialId.Separador },
        data: { stock: { decrement: quantity * 4 } },
      });
      //Descuento bolsa por paquete
      await this.prisma.material.update({
        where: { id: StaticMaterialId.Bolsa },
        data: { stock: { decrement: quantity } },
      });

      //Obtiene los materiales "Etiquetas"
      const labels = await this.getLabels();

      //etiqueta por paquete
      await this.prisma.material.update({
        where: {
          id: labels.find(
            (l) => l.name.toLowerCase() === `Etiquetas ${name}`.toLowerCase(),
          ).id,
        },
        data: { stock: { decrement: quantity } },
      });
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  private async getLabels(): Promise<Material[]> {
    try {
      return await this.prisma.material.findMany({
        where: { name: { contains: 'Etiquetas' } },
      });
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }
}
