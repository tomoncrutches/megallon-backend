import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class HistoryService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    try {
      return this.prisma.log.findMany();
    } catch (error) {
      console.error('An error has ocurred while fetching data: ', error);
      throw new Error(`An error has ocurred white fetching data : ${error}`);
    }
  }
}
