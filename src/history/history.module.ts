import { HistoryController } from './history.controller';
import { HistoryService } from './history.service';
import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [HistoryService, PrismaService],
  controllers: [HistoryController],
})
export class HistoryModule {}
