import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { HistoryService } from 'src/history/history.service';
import { MaterialController } from './material.controller';
import { MaterialService } from './material.service';
import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TransactionService } from 'src/transaction/transaction.service';

@Module({
  providers: [
    MaterialService,
    PrismaService,
    HistoryService,
    CloudinaryService,
    TransactionService,
  ],
  controllers: [MaterialController],
})
export class MaterialModule {}
