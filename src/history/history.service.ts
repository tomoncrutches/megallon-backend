import { Injectable, Logger } from '@nestjs/common';

import { Log } from '@prisma/client';
import { LogBasic, LogComplete } from 'src/types/history.types';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class HistoryService {
  constructor(private prisma: PrismaService) {}
  private readonly logger = new Logger('History Service');

  async getAll(): Promise<LogComplete[]> {
    try {
      const logsComplete: LogComplete[] = [];
      const logs = await this.prisma.log.findMany();
      for (const log of logs) {
        const user = await this.prisma.user.findUnique({
          where: { id: log.user_id },
        });
        logsComplete.push({ ...log, user: { ...user, password: undefined } });
      }
      return logsComplete;
    } catch (error) {
      this.logger.error(`Error in getAll: ${error.message}`);
      throw error;
    }
  }

  async create(data: LogBasic): Promise<Log> {
    try {
      return await this.prisma.log.create({ data });
    } catch (error) {
      this.logger.error(`Error in create: ${error.message}`);
      throw error;
    }
  }
}
