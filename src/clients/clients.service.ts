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

  async getAll(): Promise<ClientExtended[]> {
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
