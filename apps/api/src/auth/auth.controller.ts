import { Controller, Post, Body, UseGuards, Request, Res, Get, UnauthorizedException, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';

@Controller('auth') // Base path: /auth
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

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

  @Get('session')
  getSession(@Req() req: Request & { cookies: any }) { // ✅ Pastikan cookies dikenali
    const token = req.cookies?.session; // Ambil token dari cookies
    if (!token) {
      throw new UnauthorizedException('Session not found');
    }

    try {
      const payload = this.jwtService.verify(token); // ✅ Verifikasi JWT
      return { authenticated: true, user: payload };
    } catch (error) {
      throw new UnauthorizedException('Invalid session');
    }
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
  
    // // ✅ Logout endpoint
    // @UseGuards(JwtAuthGuard) // Pastikan user sudah login
    // @Post('logout')
    // async logout(@Request() req, @Res() res: Response) {
    //   console.log(`User ${req.user.nik} logging out`);
  
    //   // Hapus cookie "session"
    //   res.cookie("session", "", { 
    //     httpOnly: true, 
    //     secure: false, // Ubah ke true jika di production (HTTPS)
    //     sameSite: "lax",
    //     expires: new Date(0), // Set cookie expired
    //   });
  
    //   return res.json({ message: "Logout berhasil" });
    // }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout(@Request() req, @Res() res: Response) {
      console.log(`User ${req.user.nik} logging out`);
  
      res.cookie("session", "", { 
        httpOnly: true, 
        secure: false, // Ubah ke true jika di production (HTTPS)
        sameSite: "lax",
        expires: new Date(0),
      });
  
      res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:3000');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
  
      return res.json({ message: "Logout berhasil" });
    }
}
