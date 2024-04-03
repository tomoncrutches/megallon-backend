import { Logger, Module } from '@nestjs/common';

import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { HistoryService } from 'src/history/history.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  providers: [
    ProductsService,
    PrismaService,
    Logger,
    HistoryService,
    CloudinaryService,
  ],
  controllers: [ProductsController],
})
export class ProductsModule {}
