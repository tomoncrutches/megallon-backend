import { Module } from '@nestjs/common';
import { FinancesService } from './finances.service';
import { FinancesController } from './finances.controller';

@Module({
  providers: [FinancesService],
  controllers: [FinancesController]
})
export class FinancesModule {}
