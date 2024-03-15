import { Logger, Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { HistoryService } from 'src/history/history.service';

@Module({
  providers: [ProductsService, PrismaService, Logger, HistoryService],
  controllers: [ProductsController],
})
export class ProductsModule {}
