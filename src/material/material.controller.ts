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
} from '@nestjs/common';

import { Material } from '@prisma/client';
import { MaterialService } from './material.service';

@Controller('material')
export class MaterialController {
  constructor(private readonly service: MaterialService) {}

  @Post()
  async create(@Body() data: Material) {
    try {
      return await this.service.create(data);
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
      if (!item) throw new BadRequestException('Material not found.');
      return item;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put()
  async update(@Body() data: Material) {
    try {
      if (!('id' in data)) throw new ForbiddenException('ID is required.');
      return await this.service.update(data);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete()
  async delete(@Body() data: { id: string }) {
    const { id } = data;
    try {
      if (!id) throw new ForbiddenException('ID is required.');
      return await this.service.delete(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
