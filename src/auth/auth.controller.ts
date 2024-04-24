import { OptionalUser } from 'src/types/user.types';
import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  ForbiddenException,
  Headers,
  Post,
  UnauthorizedException,
} from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post()
  async signin(@Body() userdata: OptionalUser) {
    try {
      if (!userdata.username || !userdata.password)
        throw new ForbiddenException('Las credenciales son requeridas.');

      return await this.service.signin(userdata);
    } catch (error) {
      throw error;
    }
  }

  @Post('verify')
  async verifySession(@Headers('authorization') authorizaton: string) {
    try {
      if (!authorizaton)
        throw new UnauthorizedException(
          'El token de autorización es requerido.',
        );

      const token = authorizaton.substring(7);
      return await this.service.verifySession(token);
    } catch (error) {
      throw error;
    }
  }
}
