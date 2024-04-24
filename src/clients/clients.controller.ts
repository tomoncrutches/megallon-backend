import { ClientExtended } from 'src/types/client.types';
import { ClientsService } from './clients.service';
import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Headers,
  Logger,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { HistoryService } from 'src/history/history.service';
import { Client } from '@prisma/client';
import { getToken, isEmpty } from 'src/lib/utils';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('clients')
export class ClientsController {
  constructor(
    private readonly service: ClientsService,
    private readonly historyService: HistoryService,
    private readonly jwtService: JwtService,
  ) {}
  private readonly logger = new Logger('SalesController');

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() data: ClientExtended,
    @Headers('authorization') authorization: string,
  ) {
    try {
      const client = await this.service.create(data);
      const { sub } = await this.jwtService.decode(getToken(authorization));

      await this.historyService.create({
        action: 'Nuevo Cliente',
        description: `Se registró un nuevo cliente con el nombre ${client.name}.`,
        user_id: sub,
      });

      return client;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  async getAll() {
    try {
      return await this.service.getAll();
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Get('detail')
  async getOne(@Query() client: Client) {
    try {
      if (isEmpty(client))
        throw new ForbiddenException('Los atributos son requeridos.');
      return await this.service.getOne(client);
    } catch (error) {
      throw error;
    }
  }
}
