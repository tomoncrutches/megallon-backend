import { User } from '@prisma/client';

export type OptionalUser = {
  [key in keyof User]?: User[key];
};
