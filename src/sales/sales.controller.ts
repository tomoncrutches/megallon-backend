import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Post,
  Put,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { SaleToCreate } from 'src/types/sale.types';
import { Sale, SaleDetail } from '@prisma/client';

@Controller('sales')
export class SalesController {
  constructor(private readonly service: SalesService) {}

  @Post()
  async create(@Body() data: SaleToCreate) {
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

  @Put()
  async update(@Body() data: Sale) {
    try {
      return await this.service.update(data);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put('detail')
  async updateDetail(@Body() data: SaleDetail) {
    try {
      return await this.service.updateDetail(data);
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

  @Delete('detail')
  async deleteDetail(@Body() data: { id: string }) {
    const { id } = data;
    try {
      if (!id) throw new ForbiddenException('ID is required.');
      return this.service.deleteDetail(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
