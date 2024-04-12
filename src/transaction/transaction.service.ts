import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Transaction } from '@prisma/client';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  async create(payload: Transaction): Promise<Transaction> {
    try {
      return await this.prisma.transaction.create({ data: payload });
    } catch (error) {
      throw error;
    }
  }

  async deleteByParent(id: string) {
    try {
      return await this.prisma.transaction.deleteMany({
        where: { parent_id: id },
      });
    } catch (error) {
      throw error;
    }
  }
}
