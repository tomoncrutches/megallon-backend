import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FinancesModule } from './finances/finances.module';
import { HistoryModule } from './history/history.module';
import { MaterialModule } from './material/material.module';
import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { SalesModule } from './sales/sales.module';
import { StatisticsModule } from './statistics/statistics.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [MaterialModule, ProductsModule, HistoryModule, SalesModule, StatisticsModule, FinancesModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
