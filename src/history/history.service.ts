import { Injectable } from '@nestjs/common';
import { Log } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class HistoryService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    try {
      return await this.prisma.log.findMany();
    } catch (error) {
      console.error(
        'An error has ocurred while fetching data: ',
        error.message,
      );
      throw new Error(
        `An error has ocurred while fetching data : ${error.message}`,
      );
    }
  }

  async create(data: Log) {
    try {
      return await this.prisma.log.create({ data });
    } catch (error) {
      console.error(
        'An error has ocurred while creating data: ',
        error.message,
      );
      throw new Error(
        `An error has ocurred while creating data : ${error.message}`,
      );
    }
  }
}
