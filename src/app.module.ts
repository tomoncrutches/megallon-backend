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
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProductionModule } from './production/production.module';
import { ClientsModule } from './clients/clients.module';

@Module({
  imports: [MaterialModule, ProductsModule, HistoryModule, SalesModule, StatisticsModule, FinancesModule, AuthModule, PrismaModule, ProductionModule, ClientsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
