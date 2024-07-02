import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { HistoryService } from 'src/history/history.service';
import { MaterialService } from 'src/material/material.service';
import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductsService } from 'src/products/products.service';
import { SalesService } from 'src/sales/sales.service';
import { TransactionService } from 'src/transaction/transaction.service';

@Module({
  providers: [
    ClientsService,
    ProductsService,
    PrismaService,
    HistoryService,
    MaterialService,
    TransactionService,
    SalesService,
  ],
  controllers: [ClientsController],
})
export class ClientsModule {}
