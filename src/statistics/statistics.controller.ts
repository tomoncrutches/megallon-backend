import { Controller, Get, Logger, Query } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { StatisticsService } from './statistics.service';

@Controller('statistics')
export class StatisticsController {
  constructor(
    private readonly service: StatisticsService,
    private readonly jwtService: JwtService,
  ) {}
  private readonly logger = new Logger('StatisticsController');

  @Get('products-sold')
  async getProductsSold(@Query('timeRange') timeRange: string) {
    try {
      return await this.service.getProductsSold(timeRange);
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }
}
