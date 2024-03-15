import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { HistoryService } from 'src/history/history.service';
import { MaterialController } from './material.controller';
import { MaterialService } from './material.service';
import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [
    MaterialService,
    PrismaService,
    HistoryService,
    CloudinaryService,
  ],
  controllers: [MaterialController],
})
export class MaterialModule {}
