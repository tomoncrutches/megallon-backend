import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Post,
  Put,
  Logger,
  Query,
} from '@nestjs/common';

import { Material } from '@prisma/client';
import { MaterialService } from './material.service';
import { HistoryService } from 'src/history/history.service';
import { isEmpty } from 'src/lib/utils';

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
        action: 'Nuevo Material',
        description: `Se registró un nuevo material llamado ${material.name}.`,
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

  @Get('detail')
  async getOne(@Query() material: Material) {
    try {
      if (isEmpty(material))
        throw new ForbiddenException('Attribute is required.');
      return await this.service.getOne(material);
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
        action: 'Actualización de Material',
        description: `Se actualizó el material ${material.name}.`,
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
        action: 'Eliminación de Material',
        description: `Se eliminó el material ${material.name}.`,
        user_id: '1d6f37dc-06c7-4510-92e8-a7495e287708',
      });
      return material;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }
}
