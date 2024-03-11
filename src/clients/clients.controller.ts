import { ClientExtended } from 'src/types/client.types';
import { ClientsService } from './clients.service';
import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { HistoryService } from 'src/history/history.service';

@Controller('clients')
export class ClientsController {
  constructor(
    private readonly service: ClientsService,
    private readonly historyService: HistoryService,
  ) {}
  private readonly logger = new Logger('SalesController');

  @Post()
  async create(@Body() data: ClientExtended) {
    try {
      const client = await this.service.create(data);
      await this.historyService.create({
        action: 'Nuevo Cliente',
        description: `Se registró un nuevo cliente con el nombre ${client.name}.`,
        user_id: '1d6f37dc-06c7-4510-92e8-a7495e287708',
      });
      return client;
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
