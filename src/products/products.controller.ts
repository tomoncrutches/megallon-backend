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
      if (!item) throw new BadRequestException('Product not found.');
      return item;
    } catch (error) {
      throw error;
    }
  }

  @Put()
  async update(@Body() data: Product) {
    try {
      if (!('id' in data)) throw new ForbiddenException('ID is required.');
      return await this.service.update(data);
    } catch (error) {
      throw error;
    }
  }

  @Delete()
  async delete(@Body() data: { id: string }) {
    const { id } = data;
    try {
      return await this.service.delete(id);
    } catch (error) {
      throw error;
    }
  }
}
