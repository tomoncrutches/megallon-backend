import { Logger, Module } from '@nestjs/common';

import { ClientsService } from 'src/clients/clients.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { HistoryService } from 'src/history/history.service';
import { MaterialService } from 'src/material/material.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { SalesService } from 'src/sales/sales.service';
import { TransactionService } from 'src/transaction/transaction.service';

@Module({
  providers: [
    ProductsService,
    PrismaService,
    Logger,
    HistoryService,
    CloudinaryService,
    MaterialService,
    TransactionService,
    SalesService,
    ClientsService,
  ],
  controllers: [ProductsController],
})
export class ProductsModule {}
