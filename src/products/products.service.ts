import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) {
    }
    async create(data: any) {
        return this.prisma.product.create({ data });
    }
}
