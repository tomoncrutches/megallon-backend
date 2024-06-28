import { ClientsService } from 'src/clients/clients.service';
import { MaterialService } from 'src/material/material.service';
import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductsService } from 'src/products/products.service';
import { SalesService } from 'src/sales/sales.service';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { TransactionService } from 'src/transaction/transaction.service';

@Module({
  providers: [
    StatisticsService,
    PrismaService,
    ClientsService,
    ProductsService,
    TransactionService,
    SalesService,
    MaterialService,
  ],
  controllers: [StatisticsController],
})
export class StatisticsModule {}
