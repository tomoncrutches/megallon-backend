import { Injectable, Logger } from '@nestjs/common';

import { LogBasic } from 'src/types/history.types';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class HistoryService {
  constructor(private prisma: PrismaService) {}
  private readonly logger = new Logger('History Service');

  async getAll() {
    try {
      return await this.prisma.log.findMany();
    } catch (error) {
      this.logger.error(`Error in getAll: ${error.message}`);
      throw error;
    }
  }

  async create(data: LogBasic) {
    try {
      return await this.prisma.log.create({ data });
    } catch (error) {
      this.logger.error(`Error in create: ${error.message}`);
      throw error;
    }
  }
}
