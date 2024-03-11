import { ClientExtended } from 'src/types/client.types';
import { ClientsService } from './clients.service';
import { Body, Controller, Get, Logger, Post } from '@nestjs/common';

@Controller('clients')
export class ClientsController {
  constructor(private readonly service: ClientsService) {}
  private readonly logger = new Logger('SalesController');

  @Post()
  async create(@Body() data: ClientExtended) {
    try {
      return await this.service.create(data);
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  @Get()
  async getAll() {
    try {
      return await this.service.getAll();
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }
}
