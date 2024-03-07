import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductsService } from 'src/products/products.service';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';

@Module({
  providers: [SalesService, PrismaService, ProductsService],
  controllers: [SalesController],
})
export class SalesModule {}
