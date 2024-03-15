import { ClientsService } from 'src/clients/clients.service';
import { HistoryService } from 'src/history/history.service';
import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductsService } from 'src/products/products.service';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';

@Module({
  providers: [
    SalesService,
    PrismaService,
    ProductsService,
    HistoryService,
    ClientsService,
  ],
  controllers: [SalesController],
})
export class SalesModule {}
