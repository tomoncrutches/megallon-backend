import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { FixedSpentTypeService } from './fixed-spent-type.service';
import { FixedSpentType } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('fixed-spent-type')
export class FixedSpentTypeController {
  constructor(private readonly service: FixedSpentTypeService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getAll() {
    try {
      return await this.service.getAll();
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() data: FixedSpentType) {
    try {
      return await this.service.create(data);
    } catch (error) {
      throw error;
    }
  }
}
