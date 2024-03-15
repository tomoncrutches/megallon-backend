import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { HistoryService } from 'src/history/history.service';
import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [ClientsService, PrismaService, HistoryService],
  controllers: [ClientsController],
})
export class ClientsModule {}
