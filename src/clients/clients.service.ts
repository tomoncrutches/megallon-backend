import { ClientExtended } from 'src/types/client.types';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

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
      console.error(
        'An error has occurred while creating client data: ',
        error.message,
      );
      throw new Error(
        `An error has occurred while creating client data: ${error.message}`,
      );
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
      console.error(
        'An error has occurred while fetching clients data: ',
        error.message,
      );
      throw new Error(
        `An error has occurred while fetching clients data: ${error.message}`,
      );
    }
  }
}
