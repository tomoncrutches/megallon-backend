import { Client, ClientCoordinate } from '@prisma/client';

export interface ClientExtended {
  data: Client;
  coords: ClientCoordinate;
}
