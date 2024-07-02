import { ClientExtended, ClientsWithPredicts } from 'src/types/client.types';
import { ClientsService } from './clients.service';
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Headers,
  Logger,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { HistoryService } from 'src/history/history.service';
import { Client } from '@prisma/client';
import { getToken, isEmpty } from 'src/lib/utils';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { SalesService } from 'src/sales/sales.service';

@Controller('clients')
export class ClientsController {
  constructor(
    private readonly service: ClientsService,
    private readonly jwtService: JwtService,
    private readonly historyService: HistoryService,
    private readonly salesService: SalesService,
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
      const clients = await this.service.getAll();
      const clientsWithPredicts: ClientsWithPredicts[] = [];
      for (const client of clients) {
        const predict = await this.salesService.getPredict(client.id);
        clientsWithPredicts.push({ ...client, predict });
      }

      return clientsWithPredicts;
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

  @UseGuards(AuthGuard)
  @Put()
  async update(
    @Body() data: ClientExtended,
    @Headers('authorization') authorization: string,
  ) {
    try {
      const client = await this.service.update(data);
      const { sub } = await this.jwtService.decode(getToken(authorization));

      await this.historyService.create({
        action: 'Actualización de Cliente',
        description: `Se actualizó el cliente con el nombre ${client.name}.`,
        user_id: sub,
      });

      return client;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Delete()
  async delete(
    @Query() query: { id: string },
    @Headers('authorization') authorization: string,
  ) {
    try {
      const { sub } = await this.jwtService.decode(getToken(authorization));
      if (!query.id)
        throw new ForbiddenException('Los atributos son requeridos.');

      const { id } = query;

      const deletedClient = await this.service.delete(id);
      await this.historyService.create({
        action: 'Eliminación de Cliente',
        description: `Se eliminó el cliente con el nombre ${deletedClient.name}.`,
        user_id: sub,
      });

      return deletedClient;
    } catch (error) {
      throw error;
    }
  }
}
