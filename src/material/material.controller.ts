import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Post,
  Put,
  Logger,
  Query,
  UseInterceptors,
  UploadedFile,
  Patch,
} from '@nestjs/common';

import { Material } from '@prisma/client';
import { MaterialService } from './material.service';
import { HistoryService } from 'src/history/history.service';
import { isEmpty } from 'src/lib/utils';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { MaterialForBuy } from 'src/types/material.types';

@Controller('material')
export class MaterialController {
  constructor(
    private readonly service: MaterialService,
    private readonly historyService: HistoryService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}
  private readonly logger = new Logger('MaterialController');

  @Post()
  @UseInterceptors(
    FileInterceptor('image_file', {
      dest: './.temp',
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: { material: Material | string },
  ) {
    const payload: Material = JSON.parse(data.material as string);

    try {
      const { secure_url } = await this.cloudinaryService.uploadFile(
        file.path,
        'material',
      );
      const material = await this.service.create({
        ...payload,
        image: secure_url,
      });
      await this.historyService.create({
        action: 'Nuevo Material',
        description: `Se registró un nuevo material llamado ${material.name}.`,
        user_id: '1d6f37dc-06c7-4510-92e8-a7495e287708',
      });
      return material;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  @Get()
  async getAll() {
    try {
      return await this.service.getAll();
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  @Get('detail')
  async getOne(@Query() material: Material) {
    try {
      if (isEmpty(material))
        throw new ForbiddenException('Los atributos son requeridos.');
      return await this.service.getOne(material);
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }
  @UseInterceptors(
    FileInterceptor('image_file', {
      dest: './.temp',
    }),
  )
  @Put()
  async update(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: { material: Material | string },
  ) {
    const payload: Material = JSON.parse(data.material as string);
    try {
      if (!('id' in payload))
        throw new ForbiddenException('El ID es requerido.');

      const imageURL: string = file
        ? (await this.cloudinaryService.uploadFile(file.path, 'material'))
            .secure_url
        : payload.image;
      const material = await this.service.update({
        ...payload,
        image: imageURL,
      });
      await this.historyService.create({
        action: 'Actualización de Material',
        description: `Se actualizó el material ${material.name}.`,
        user_id: '1d6f37dc-06c7-4510-92e8-a7495e287708',
      });
      return material;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  @Patch('buy')
  async buyMaterial(@Body() data: MaterialForBuy) {
    const { id, price, quantity } = data;
    try {
      if (!id || !price || !quantity)
        throw new ForbiddenException('Los atributos son requeridos.');

      const material = await this.service.buyMaterial(data);
      await this.historyService.create({
        action: 'Compra de Material',
        description: `Se compró ${quantity} gramos del material ${material.name} a un precio de $${price} por kg.`,
        user_id: '1d6f37dc-06c7-4510-92e8-a7495e287708',
      });
      return material;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  @Delete()
  async delete(@Body() data: { id: string }) {
    const { id } = data;
    try {
      if (!id) throw new ForbiddenException('El ID es requerido.');

      const material = await this.service.delete(id);
      await this.historyService.create({
        action: 'Eliminación de Material',
        description: `Se eliminó el material ${material.name}.`,
        user_id: '1d6f37dc-06c7-4510-92e8-a7495e287708',
      });
      return material;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }
}
