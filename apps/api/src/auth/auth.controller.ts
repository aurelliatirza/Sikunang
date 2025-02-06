import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Controller('auth') // Base path: /auth
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register') // Endpoint: /auth/register
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.registerUser(createUserDto);
  }
}
