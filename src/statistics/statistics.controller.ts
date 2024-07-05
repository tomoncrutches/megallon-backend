import { Controller, Get, Logger, Query, UseGuards } from '@nestjs/common';

import { StatisticsService } from './statistics.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly service: StatisticsService) {}
  private readonly logger = new Logger('StatisticsController');

  @UseGuards(AuthGuard)
  @Get()
  async getGeneralStatistics(
    @Query('timeRange') timeRange: string,
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
  ) {
    try {
      return await this.service.getGeneralStatistics(
        timeRange,
        startDate,
        endDate,
      );
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Get('products-sold')
  async getProductsSold(
    @Query('timeRange') timeRange?: string,
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
  ) {
    try {
      return await this.service.getProductsSold(timeRange, startDate, endDate);
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Get('clients-purchases')
  async getClientsPurchases(
    @Query('timeRange') timeRange?: string,
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
  ) {
    try {
      return await this.service.getClientsPurchases(
        timeRange,
        startDate,
        endDate,
      );
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }
}
