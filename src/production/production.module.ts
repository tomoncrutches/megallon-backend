import { Module } from '@nestjs/common';
import { ProductionService } from './production.service';
import { ProductionController } from './production.controller';
import { ProductsService } from 'src/products/products.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { HistoryService } from 'src/history/history.service';

@Module({
  providers: [
    ProductionService,
    ProductsService,
    PrismaService,
    HistoryService,
  ],
  controllers: [ProductionController],
})
export class ProductionModule {}
