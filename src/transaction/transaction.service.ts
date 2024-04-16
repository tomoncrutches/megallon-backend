import { Injectable, Logger } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { Transaction } from '@prisma/client';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}
  private readonly logger = new Logger('Transaction');

  async getAll(): Promise<Transaction[]> {
    try {
      return await this.prisma.transaction.findMany();
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getAllIncome(): Promise<Transaction[]> {
    try {
      return await this.prisma.transaction.findMany({
        where: {
          value: {
            gt: 0,
          },
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getAllExpenses(type: string): Promise<Transaction[]> {
    try {
      return await this.prisma.transaction.findMany({
        where: {
          value: {
            lt: 0,
          },
          type: type ?? undefined,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

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

  // Función para obtener balance desde una fecha hasta la actual
  // (en un futuro se implementará fecha de finalización para mejor escalabilidad)
  async getBalance({ startTimeStamp }: { startTimeStamp: number }) {
    try {
      const startDate = new Date(startTimeStamp);
      const transactions = await this.prisma.transaction.findMany({
        where: { date: { gte: startDate } },
      });
      return transactions.reduce((total, t) => total + t.value, 0);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
