import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { Product } from '@prisma/client';
import { ProductsService } from './products.service';
import { HistoryService } from 'src/history/history.service';
import { isEmpty } from 'src/lib/utils';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly service: ProductsService,
    private readonly historyService: HistoryService,
    private readonly clodinaryService: CloudinaryService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image_file', {
      dest: './.temp',
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: { product: Product | string },
  ) {
    const payload: Product = JSON.parse(data.product as string);
    try {
      const { secure_url } = await this.clodinaryService.uploadFile(
        file.path,
        'products',
      );
      const newProduct = await this.service.create({
        ...payload,
        image: secure_url,
      });
      await this.historyService.create({
        action: 'Nuevo Producto',
        description: `Se registró un nuevo producto llamado ${newProduct.name}.`,
        user_id: '1d6f37dc-06c7-4510-92e8-a7495e287708',
      });
      return newProduct;
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async getAll() {
    try {
      return await this.service.getAll();
    } catch (error) {
      throw error;
    }
  }

  @Get('types')
  async getAllTypes() {
    try {
      return await this.service.getAllTypes();
    } catch (error) {
      throw error;
    }
  }

  @Get('detail')
  async getOne(@Query() product: Product) {
    try {
      if (isEmpty(product))
        throw new ForbiddenException('Los atributos son requeridos.');

      return await this.service.getOne(product);
    } catch (error) {
      throw error;
    }
  }

  @Put()
  async update(@Body() data: Product) {
    try {
      if (!('id' in data)) throw new ForbiddenException('El ID es requerido.');
      const updated = await this.service.update(data);
      this.historyService.create({
        action: 'Actualización de Producto',
        description: `Se actualizó el producto ${updated.name}. `,
        user_id: '1d6f37dc-06c7-4510-92e8-a7495e287708',
      });
      return updated;
    } catch (error) {
      throw error;
    }
  }

  @Delete()
  async delete(@Body() data: { id: string }) {
    const { id } = data;
    try {
      if (!id) throw new BadRequestException('El ID es requerido.');

      const deleted = await this.service.delete(id);
      this.historyService.create({
        action: 'Eliminación de Producto',
        description: `Se eliminó el producto ${deleted.name}. `,
        user_id: '1d6f37dc-06c7-4510-92e8-a7495e287708',
      });
      return deleted;
    } catch (error) {
      throw error;
    }
  }
}
