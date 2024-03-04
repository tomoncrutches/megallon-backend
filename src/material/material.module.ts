import { Module } from '@nestjs/common';
import { MaterialService } from './material.service';
import { MaterialController } from './material.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [MaterialService, PrismaService],
  controllers: [MaterialController]
})
export class MaterialModule {}
