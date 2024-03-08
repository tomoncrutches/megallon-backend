import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Post,
  Put,
  Logger,
  Param,
} from '@nestjs/common';

import { Product } from '@prisma/client';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}
  private readonly logger = new Logger('Product Controller');

  @Post()
  async create(@Body() data: Product) {
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
      if (!item) throw new BadRequestException('Product not found.');
      return item;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put()
  async update(@Body() data: Product) {
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
      return await this.service.delete(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
