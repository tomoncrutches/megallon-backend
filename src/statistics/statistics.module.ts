import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [StatisticsService, PrismaService],
  controllers: [StatisticsController]
})
export class StatisticsModule {}
