import { Controller, Get, Query } from '@nestjs/common';

import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly service: TransactionService) {}

  @Get()
  async getAll() {
    try {
      return await this.service.getAll();
    } catch (error) {
      throw error;
    }
  }

  @Get('income')
  async getAllIncome() {
    try {
      return await this.service.getAllIncome();
    } catch (error) {
      throw error;
    }
  }

  @Get('expenses')
  async getAllSpent(@Query() params: { type?: string }) {
    try {
      return await this.service.getAllExpenses(params.type);
    } catch (error) {
      throw error;
    }
  }
}
