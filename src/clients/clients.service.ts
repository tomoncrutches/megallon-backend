import { Injectable, Logger } from '@nestjs/common';

import { ClientExtended } from 'src/types/client.types';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}
  private readonly logger = new Logger('ClientsService');

  async create(payload: ClientExtended) {
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

  async getAll() {
    try {
      const clients = await this.prisma.client.findMany();
      const clientsExtended: ClientExtended[] = [];

      for (const client of clients) {
        const coords = await this.prisma.clientCoordinate.findUnique({
          where: { id: client.address_id },
        });

        clientsExtended.push({
          data: client,
          coords,
        });
      }
      return clientsExtended;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }
}
