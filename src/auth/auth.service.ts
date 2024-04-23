import { Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { OptionalUser } from 'src/types/user.types';
import { PrismaService } from 'src/prisma/prisma.service';
import { verifyPassword } from 'src/lib/utils';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signin(userdata: OptionalUser): Promise<{ access_token: string }> {
    try {
      const { username, password } = userdata;
      const user = await this.prisma.user.findUnique({
        where: { username },
      });
      if (!user)
        throw new UnauthorizedException('Las credenciales son incorrectas.');

      const passwordMatch = await verifyPassword({
        password,
        storedPassword: user.password,
      });
      if (!passwordMatch)
        throw new UnauthorizedException('Las credenciales son incorrectas.');

      const payload = { sub: user.id, username, name: user.name };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      throw error;
    }
  }
}
