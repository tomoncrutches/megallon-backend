import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Log } from '@prisma/client';

@Injectable()
export class HistoryService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    try {
      return await this.prisma.log.findMany();
    } catch (error) {
      console.error('An error has ocurred while fetching data: ', error);
      throw new Error(`An error has ocurred white fetching data : ${error}`);
    }
  }

  async create(data: Log) {
    try {
      return await this.prisma.log.create({ data });
    } catch (error) {
      console.error('An error has ocurred while creating data: ', error);
      throw new Error(`An error has ocurred white creating data : ${error}`);
    }
  }
}
