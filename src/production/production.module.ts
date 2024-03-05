import { Module } from '@nestjs/common';
import { ProductionService } from './production.service';
import { ProductionController } from './production.controller';
import { ProductsService } from 'src/products/products.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [ProductionService, ProductsService, PrismaService],
  controllers: [ProductionController],
})
export class ProductionModule {}
