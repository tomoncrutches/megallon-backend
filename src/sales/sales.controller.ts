import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Logger,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { SaleExtended, SaleToCreate } from 'src/types/sale.types';
import { Sale, SaleDetail } from '@prisma/client';
import { HistoryService } from 'src/history/history.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('sales')
export class SalesController {
  constructor(
    private readonly service: SalesService,
    private readonly historyService: HistoryService,
  ) {}
  private readonly logger = new Logger('SalesController');

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() data: SaleToCreate) {
    try {
      const sale = await this.service.create(data);
      await this.historyService.create({
        action: 'Nueva Venta',
        description: `Se registró una nueva venta con el ID ${sale.id}.`,
        user_id: '1d6f37dc-06c7-4510-92e8-a7495e287708',
      });
      return sale;
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
  @Get('lastweek')
  async getLastWeek() {
    try {
      return await this.service.getLastWeek();
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Get('detail')
  async getOne(@Query() sale: SaleExtended) {
    try {
      if (!sale.id) throw new ForbiddenException('El ID es requerido.');
      return await this.service.getOne(sale);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Put()
  async update(@Body() data: Sale) {
    try {
      const sale = await this.service.update(data);
      await this.historyService.create({
        action: 'Actualización de Venta',
        description: `Se actualizó la venta con ID ${sale.id}.`,
        user_id: '1d6f37dc-06c7-4510-92e8-a7495e287708',
      });
      return sale;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Patch('paid')
  async changeStatusPaid(@Body() data: { id: string }) {
    try {
      const sale = await this.service.changeStatusPaid(data.id);
      await this.historyService.create({
        action: 'Cambio de Estado de Pago',
        description: `Se cambió el estado de pago de la venta con ID ${sale.id}.`,
        user_id: '1d6f37dc-06c7-4510-92e8-a7495e287708',
      });
      return sale;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Patch('delivered')
  async changeStatusDelivered(@Body() data: { id: string }) {
    try {
      const sale = await this.service.changeStatusDelivered(data.id);
      await this.historyService.create({
        action: 'Cambio de Estado de Entrega',
        description: `Se cambió el estado de entrega de la venta con ID ${sale.id}.`,
        user_id: '1d6f37dc-06c7-4510-92e8-a7495e287708',
      });
      return sale;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Put('detail')
  async updateDetail(@Body() data: SaleDetail) {
    try {
      const detail = await this.service.updateDetail(data);
      await this.historyService.create({
        action: 'Actualización de Detalle de Venta',
        description: `Se actualizó el detalle con ID ${detail.id} de la venta con ID ${detail.sale_id}.`,
        user_id: '1d6f37dc-06c7-4510-92e8-a7495e287708',
      });
      return detail;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Delete()
  async delete(@Body() data: { id: string }) {
    const { id } = data;
    try {
      if (!id) throw new ForbiddenException('El ID es requerido.');

      const sale = await this.service.delete(id);
      await this.historyService.create({
        action: 'Eliminación de Venta',
        description: `Se eliminó la venta con ID ${sale.id}.`,
        user_id: '1d6f37dc-06c7-4510-92e8-a7495e287708',
      });
      return sale;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Delete('detail')
  async deleteDetail(@Body() data: { id: string }) {
    const { id } = data;
    try {
      if (!id) throw new ForbiddenException('El ID es requerido.');

      const detail = await this.service.deleteDetail(id);
      await this.historyService.create({
        action: 'Eliminación de Detalle de Venta',
        description: `Se eliminó el detalle con ID ${detail.id} de la venta con ID ${detail.sale_id}.`,
        user_id: '1d6f37dc-06c7-4510-92e8-a7495e287708',
      });
      return detail;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }
}
