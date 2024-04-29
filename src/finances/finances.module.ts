import { Module } from '@nestjs/common';
import { FinancesService } from './finances.service';
import { FinancesController } from './finances.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [FinancesService, PrismaService],
  controllers: [FinancesController]
})
export class FinancesModule {}
