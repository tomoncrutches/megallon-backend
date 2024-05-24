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
      const address = await this.prisma.clientCoordinate.create({
        data: {
          lat: payload.address.lat,
          lon: payload.address.lon,
          address: payload.address.address,
        },
      });
      return await this.prisma.client.create({
        data: {
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          attention: payload.attention,
          address_id: address.id,
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
        where: { attention: { not: null } },
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
      const dbClient = await this.prisma.client.findFirst({
        where: client,
        include: { address: true },
      });
      if (!dbClient) throw new NotFoundException('El cliente no existe.');

      return dbClient;
    } catch (error) {
      throw error;
    }
  }

  async update(payload: ClientExtended): Promise<Client> {
    try {
      const dbClient = await this.prisma.client.findFirst({
        where: { id: payload.id },
        include: { address: true },
      });
      if (!dbClient) throw new NotFoundException('El cliente no existe.');

      const address = await this.prisma.clientCoordinate.update({
        where: { id: dbClient.address.id },
        data: {
          lat: payload.address.lat,
          lon: payload.address.lon,
          address: payload.address.address,
        },
      });
      return await this.prisma.client.update({
        where: { id: dbClient.id },
        data: {
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          attention: payload.attention,
          address_id: address.id,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string): Promise<Client> {
    try {
      const dbClient = await this.prisma.client.findFirst({
        where: {
          id,
        },
        include: { address: true },
      });
      if (!dbClient) throw new NotFoundException('El cliente no existe.');

      return await this.prisma.client.update({
        where: { id: dbClient.id },
        data: {
          attention: null,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
