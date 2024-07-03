import { Controller, Get, Logger, Query, UseGuards } from '@nestjs/common';

import { StatisticsService } from './statistics.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly service: StatisticsService) {}
  private readonly logger = new Logger('StatisticsController');

  @UseGuards(AuthGuard)
  @Get()
  async getGeneralStatistics(@Query('timeRange') timeRange: string) {
    try {
      return await this.service.getGeneralStatistics(timeRange);
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Get('products-sold')
  async getProductsSold(@Query('timeRange') timeRange: string) {
    try {
      return await this.service.getProductsSold(timeRange);
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Get('clients-purchases')
  async getClientsPurchases(@Query('timeRange') timeRange: string) {
    try {
      return await this.service.getClientsPurchases(timeRange);
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }
}
