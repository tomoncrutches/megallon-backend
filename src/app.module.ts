import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ClientsModule } from './clients/clients.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { ConfigModule } from '@nestjs/config';
import { FinancesModule } from './finances/finances.module';
import { HistoryModule } from './history/history.module';
import { MaterialModule } from './material/material.module';
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { ProductionModule } from './production/production.module';
import { ProductsModule } from './products/products.module';
import { SalesModule } from './sales/sales.module';
import { StatisticsModule } from './statistics/statistics.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MulterModule.register(),
    MaterialModule,
    ProductsModule,
    HistoryModule,
    SalesModule,
    StatisticsModule,
    FinancesModule,
    AuthModule,
    PrismaModule,
    ProductionModule,
    ClientsModule,
    CloudinaryModule,
    TransactionModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, CloudinaryService],
})
export class AppModule {}
