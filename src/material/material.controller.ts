import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Post,
  Put,
  Param,
  Logger,
} from '@nestjs/common';

import { Material } from '@prisma/client';
import { MaterialService } from './material.service';

@Controller('material')
export class MaterialController {
  constructor(private readonly service: MaterialService) {}
  private readonly logger = new Logger('MaterialController');

  @Post()
  async create(@Body() data: Material) {
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

  @Get(':index')
  async getOne(@Param() index: object) {
    try {
      const item = await this.service.getOne({ id: index['index'] });
      if (!item) throw new BadRequestException('Material not found.');

      return item;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  @Put()
  async update(@Body() data: Material) {
    try {
      if (!('id' in data)) throw new ForbiddenException('ID is required.');

      return await this.service.update(data);
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  @Delete()
  async delete(@Body() data: { id: string }) {
    const { id } = data;
    try {
      if (!id) throw new ForbiddenException('ID is required.');

      return await this.service.delete(id);
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }
}
