import { Client, ClientCoordinate } from '@prisma/client';

export interface ClientExtended extends Client {
  address: ClientCoordinate;
}

export type OptionalClient = {
  [key in keyof Client]?: Client[key];
};

export type ClientTimeInformation = {
  daysForNextBuy: number;
  buyInterval: number;
};

export interface ClientsWithPredicts extends Client {
  predict: ClientTimeInformation;
}
