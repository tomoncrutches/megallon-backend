import { Body, Controller, Get, Post } from '@nestjs/common';
import { HistoryService } from './history.service';
import { Log } from '@prisma/client';

@Controller('history')
export class HistoryController {
  constructor(private readonly service: HistoryService) {}

  @Post()
  async create(@Body() data: Log) {
    try {
      return await this.service.create(data);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async getAll() {
    try {
      return await this.service.getAll();
    } catch (error) {
      throw error;
    }
  }
}
