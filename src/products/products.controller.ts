import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Headers,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { Product } from '@prisma/client';
import { ProductsService } from './products.service';
import { HistoryService } from 'src/history/history.service';
import { getToken, isEmpty } from 'src/lib/utils';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ProductForCreate } from 'src/types/product.types';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly service: ProductsService,
    private readonly historyService: HistoryService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly jwtService: JwtService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('image_file', {
      dest: './.temp',
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: { product: ProductForCreate | string },
    @Headers('authorization') authorization: string,
  ) {
    const payload: ProductForCreate = JSON.parse(data.product as string);
    try {
      const { secure_url } = await this.cloudinaryService.uploadFile(
        file.path,
        'products',
      );
      const newProduct: Product = await this.service.create({
        ...payload,
        image: secure_url,
      });
      const { sub } = await this.jwtService.decode(getToken(authorization));

      await this.historyService.create({
        action: 'Nuevo Producto',
        description: `Se registró un nuevo producto llamado ${newProduct.name}.`,
        user_id: sub,
      });

      return newProduct;
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  async getAll() {
    try {
      return await this.service.getAll();
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Get('types')
  async getAllTypes() {
    try {
      return await this.service.getAllTypes();
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @UseGuards(AuthGuard)
  @Patch('types')
  async updateType(
    @Body() payload: { id: string; price: number; retail_price: number },
  ) {
    const { id, price, retail_price } = payload;
    if (!id || !price || !retail_price)
      throw new ForbiddenException('Los atributos son requeridos.');

    try {
      return await this.service.updateType(id, price, retail_price);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('image_file', {
      dest: './.temp',
    }),
  )
  @Put()
  async update(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: { product: string },
    @Headers('authorization') authorization: string,
  ) {
    const payload: ProductForCreate = JSON.parse(data.product);
    try {
      if (!('id' in payload))
        throw new ForbiddenException('El ID es requerido.');

      const imageURL: string = file
        ? (await this.cloudinaryService.uploadFile(file.path, 'material'))
            .secure_url
        : payload.image;
      const updated = await this.service.update({
        ...payload,
        image: imageURL,
      });
      const { sub } = await this.jwtService.decode(getToken(authorization));

      this.historyService.create({
        action: 'Actualización de Producto',
        description: `Se actualizó el producto ${updated.name}. `,
        user_id: sub,
      });

      return updated;
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Delete()
  async delete(
    @Query() data: { id: string },
    @Headers('authorization') authorization: string,
  ) {
    const { id } = data;
    try {
      if (!id) throw new BadRequestException('El ID es requerido.');

      const deleted = await this.service.delete(id);
      const { sub } = await this.jwtService.decode(getToken(authorization));

      this.historyService.create({
        action: 'Eliminación de Producto',
        description: `Se eliminó el producto ${deleted.name}. `,
        user_id: sub,
      });

      return deleted;
    } catch (error) {
      throw error;
    }
  }
}
