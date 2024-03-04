import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [SalesService, PrismaService],
  controllers: [SalesController]
})
export class SalesModule {}
