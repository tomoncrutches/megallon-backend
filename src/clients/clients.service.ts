import { ClientExtended, OptionalClient } from 'src/types/client.types';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { Client } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}
  private readonly logger = new Logger('ClientsService');

  async create(payload: ClientExtended): Promise<Client> {
    try {
      const coords = await this.prisma.clientCoordinate.create({
        data: {
          lat: payload.coords.lat,
          lon: payload.coords.lon,
        },
      });
      return await this.prisma.client.create({
        data: {
          ...payload.data,
          address_id: coords.id,
        },
      });
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async getAll(): Promise<Client[]> {
    try {
      return this.prisma.client.findMany({
        include: {
          address: true,
        },
      });
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async getOne(client: OptionalClient): Promise<Client> {
    try {
      const dbClient = await this.prisma.client.findFirst({ where: client });
      if (!dbClient) throw new NotFoundException('El cliente no existe.');

      return dbClient;
    } catch (error) {
      throw error;
    }
  }
}
