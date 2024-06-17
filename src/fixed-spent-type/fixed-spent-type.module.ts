import { FixedSpentTypeController } from './fixed-spent-type.controller';
import { FixedSpentTypeService } from './fixed-spent-type.service';
import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [FixedSpentTypeController],
  providers: [FixedSpentTypeService, PrismaService],
})
export class FixedSpentTypeModule {}
