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
import { HistoryService } from 'src/history/history.service';

@Controller('material')
export class MaterialController {
  constructor(
    private readonly service: MaterialService,
    private readonly historyService: HistoryService,
  ) {}
  private readonly logger = new Logger('MaterialController');

  @Post()
  async create(@Body() data: Material) {
    try {
      const material = await this.service.create(data);
      await this.historyService.create({
        action: 'Nueva materia prima',
        description: `Se llevo a cabo la creación de la materia prima ${data.name}.`,
        user_id: '1d6f37dc-06c7-4510-92e8-a7495e287708',
      });
      return material;
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

      const material = await this.service.update(data);
      await this.historyService.create({
        action: 'Actualizar materia prima',
        description: `Se llevó a cabo la actualización de la materia prima ${data.name}.`,
        user_id: '1d6f37dc-06c7-4510-92e8-a7495e287708',
      });
      return material;
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

      const material = await this.service.delete(id);
      await this.historyService.create({
        action: 'Eliminar materia prima',
        description: `Se llevó a cabo eliminación de la materia prima ${material.name}.`,
        user_id: '1d6f37dc-06c7-4510-92e8-a7495e287708',
      });
      return material;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }
}
