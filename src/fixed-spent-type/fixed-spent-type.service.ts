import { FixedSpentType } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FixedSpentTypeService {
  constructor(private prisma: PrismaService) {}

  async getAll(): Promise<FixedSpentType[]> {
    try {
      return await this.prisma.fixedSpentType.findMany();
    } catch (error) {
      throw error;
    }
  }

  async create(payload: FixedSpentType): Promise<FixedSpentType> {
    try {
      return await this.prisma.fixedSpentType.create({ data: payload });
    } catch (error) {
      throw error;
    }
  }
}
