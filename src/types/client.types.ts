import { Client, ClientCoordinate } from '@prisma/client';

export interface ClientExtended {
  data: Client;
  coords: ClientCoordinate;
}

export type OptionalClient = {
  [key in keyof Client]?: Client[key];
};
