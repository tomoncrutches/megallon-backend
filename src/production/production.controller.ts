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

@Controller('production')
export class ProductionController {
  constructor(private readonly service: ProductionService) {}

  @Post()
  async create(@Body() data: Production, @Body() list: ProductionDetail[]) {
    try {
      return await this.service.create(data, list);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  async getAll() {
    try {
      return await this.service.getAll();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':index')
  async getOne(@Param() index: object) {
    try {
      const item = await this.service.getOne({ id: index['index'] });
      if (!item) throw new BadRequestException('Production not found.');
      return item;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put()
  async updateProduction(@Body() data: Production) {
    try {
      if (!('id' in data)) throw new ForbiddenException('ID is required.');
      return await this.service.update(data);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put()
  async updateProductionDetail(@Body() data: ProductionDetail) {
    try {
      if (!('id' in data)) throw new ForbiddenException('ID is required.');
      return await this.service.updateProductionDetails(data);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete()
  async deleteProduction(@Body() data: { id: string }) {
    const { id } = data;
    try {
      return await this.service.delete(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete()
  async deleteProductionDetail(@Body() data: { id: string }) {
    const { id } = data;
    try {
      return await this.service.deleteProductionDetail(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
