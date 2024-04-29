import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { TransactionService } from './transaction.service';
import { Transaction } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly service: TransactionService) {}

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
  async create(@Body() data: Transaction) {
    try {
      return await this.service.create(data);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Get('income')
  async getAllIncome(@Query() params: { initialDate?: string }) {
    try {
      return await this.service.getAllIncome({
        initialDate: params.initialDate,
      });
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Get('expenses')
  async getAllSpent(@Query() params: { initialDate?: string; type?: string }) {
    try {
      return await this.service.getAllExpenses({
        initialDate: params.initialDate,
        type: params.type,
      });
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Get('balance')
  async getBalance(@Query() params: { startTimestamp: string }) {
    try {
      const { startTimestamp } = params;
      if (!startTimestamp)
        throw new ForbiddenException('La fecha inicial es requerida.');

      const startTimestampParsed = Number(startTimestamp);
      const balance = await this.service.getBalance({
        startTimeStamp: startTimestampParsed,
      });

      return { balance };
    } catch (error) {
      throw error;
    }
  }
}
