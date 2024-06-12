import { HistoryService } from 'src/history/history.service';
import { MaterialService } from 'src/material/material.service';
import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductionController } from './production.controller';
import { ProductionService } from './production.service';
import { ProductsService } from 'src/products/products.service';
import { TransactionService } from 'src/transaction/transaction.service';

@Module({
  providers: [
    ProductionService,
    ProductsService,
    MaterialService,
    PrismaService,
    TransactionService,
    HistoryService,
  ],
  controllers: [ProductionController],
})
export class ProductionModule {}
