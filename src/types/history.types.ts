import { Log } from '@prisma/client';
import { User } from '@prisma/client';

export interface LogBasic {
  action: string;
  description: string;
  user_id: string;
}

export interface LogComplete extends Omit<Log, 'user_id'> {
  user: User;
}
