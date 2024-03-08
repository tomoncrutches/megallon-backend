import { Logger, Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [ProductsService, PrismaService, Logger],
  controllers: [ProductsController],
})
export class ProductsModule {}
