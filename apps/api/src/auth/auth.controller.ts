import { Controller, Post, Body, UseGuards, Request, Res, Get, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { Response } from 'express';

@Controller('auth') // Base path: /auth
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register') // Endpoint: /auth/register
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.registerUser(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Res() res: Response) {
    console.log("Login request received:", req.user);
    const { access_token, user } = await this.authService.login(req.user);
  
    // ✅ Simpan token ke cookie HTTP-only
    res.cookie("session", access_token, {
      httpOnly: true,
      secure: false, // Ubah menjadi "true" jika di production (HTTPS)
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
    });
  
    console.log("Response Sent:", { id: user.id, name: user.name, jabatan: user.jabatan });
    return res.json({ 
      id: user.id, 
      name: user.name, 
      jabatan: user.jabatan,
    });
  }

  @UseGuards(JwtAuthGuard) // ✅ Gunakan JWT Auth Guard
  @Get('profile')
  async getProfile(@Request() req) {
    console.log("User jwt profile requested:", req.user); // Debug log
    if (!req.user) {
      throw new UnauthorizedException("User tidak ditemukan");
    }
    return req.user; // ✅ JWT payload akan otomatis masuk ke sini
  }
  
}
