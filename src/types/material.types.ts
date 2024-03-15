import { Material } from '@prisma/client';

export type OptionalMaterial = {
  [key in keyof Material]?: Material[key];
};
