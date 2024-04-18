import { Injectable, Logger } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { Transaction } from '@prisma/client';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}
  private readonly logger = new Logger('Transaction');

  async getAll(): Promise<Transaction[]> {
    try {
      return await this.prisma.transaction.findMany({
        orderBy: {
          date: 'desc',
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getAllIncome({
    initialDate,
  }: {
    initialDate?: string;
  }): Promise<Transaction[]> {
    try {
      return await this.prisma.transaction.findMany({
        where: {
          value: {
            gt: 0,
          },
          date: {
            gte: initialDate.length > 0 ? initialDate : undefined,
          },
        },
        orderBy: {
          date: 'desc',
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getAllExpenses({
    initialDate,
    type,
  }: {
    initialDate?: string;
    type?: string;
  }): Promise<Transaction[]> {
    try {
      return await this.prisma.transaction.findMany({
        where: {
          value: {
            lt: 0,
          },
          date: {
            gte: initialDate.length > 0 ? initialDate : undefined,
          },
          type: type.length > 0 ? type : undefined,
        },
        orderBy: {
          date: 'desc',
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
