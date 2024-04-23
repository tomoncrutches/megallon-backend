import { OptionalUser } from 'src/types/user.types';
import { AuthService } from './auth.service';
import { Body, Controller, ForbiddenException, Post } from '@nestjs/common';

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
}
