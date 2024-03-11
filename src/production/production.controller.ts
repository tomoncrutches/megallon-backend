import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { Production, ProductionDetail } from '@prisma/client';
import { ProductionService } from './production.service';
import { HistoryService } from 'src/history/history.service';

@Controller('production')
export class ProductionController {
  constructor(
    private readonly service: ProductionService,
    private readonly historyService: HistoryService,
  ) {}

  @Post()
  async create(@Body() data: Production, list: ProductionDetail[]) {
    try {
      const newProduction = await this.service.create(data, list);
      await this.historyService.create({
        action: 'Nueva producción',
        description: `Se llevo a cabo la creacion de la producción del dia ${newProduction.date.toLocaleDateString}.`,
        user_id: '1d6f37dc-06c7-4510-92e8-a7495e287708',
      });
      return newProduction;
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

  @Get(':id')
  async getOne(@Param() id: object) {
    try {
      const item = await this.service.getOne(id);
      if (!item) throw new BadRequestException('Production not found.');
      return item;
    } catch (error) {
      throw error;
    }
  }

  @Put()
  async updateProduction(@Body() data: Production) {
    try {
      if (!('id' in data)) throw new ForbiddenException('ID is required.');
      const updatedProduction = await this.service.update(data);
      await this.historyService.create({
        action: 'Actualización de producción',
        description: `Se llevo a cabo la actualización de la producción del dia ${updatedProduction.date.toLocaleDateString}.`,
        user_id: '1d6f37dc-06c7-4510-92e8-a7495e287708',
      });
      return updatedProduction;
    } catch (error) {
      throw error;
    }
  }

  @Put()
  async updateProductionDetail(@Body() data: ProductionDetail) {
    try {
      if (!('id' in data)) throw new ForbiddenException('ID is required.');
      return await this.service.updateProductionDetails(data);
    } catch (error) {
      throw error;
    }
  }

  @Delete()
  async deleteProduction(@Body() data: { id: string }) {
    const { id } = data;
    try {
      const deleted = await this.service.delete(id);
      await this.historyService.create({
        action: 'Eliminación de producción',
        description: `Se llevo a cabo la eliminación de la producción del dia ${deleted.date.toLocaleDateString}.`,
        user_id: '1d6f37dc-06c7-4510-92e8-a7495e287708',
      });
      return await this.service.delete(id);
    } catch (error) {
      throw error;
    }
  }

  @Delete()
  async deleteProductionDetail(@Body() data: { id: string }) {
    const { id } = data;
    try {
      return await this.service.deleteProductionDetail(id);
    } catch (error) {
      throw error;
    }
  }
}
