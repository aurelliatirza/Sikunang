import { ConflictException, Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly prisma: PrismaService, // Tambahkan PrismaService untuk validasi Karyawan
  ) {}

  async registerUser(createUserDto: CreateUserDto) {
    console.log('Memproses registrasi di AuthService:', createUserDto);
  
    const { nik, username } = createUserDto;
  
    // 1️⃣ Pastikan NIK ada di tabel Karyawan
    const existingKaryawan = await this.prisma.karyawan.findUnique({
      where: { nik },
    });
  
    if (!existingKaryawan) {
      console.log('NIK tidak ditemukan di tabel Karyawan');
      throw new BadRequestException('NIK tidak ditemukan di tabel Karyawan');
    }
  
    // 2️⃣ Pastikan user belum terdaftar
    const existingUser = await this.userService.findByNIK(nik);
    if (existingUser) {
      console.log('NIK sudah terdaftar');
      throw new ConflictException('NIK sudah terdaftar');
    }
  
    const existingUsername = await this.userService.findByUsername(username);
    if (existingUsername) {
      console.log('Username sudah digunakan');
      throw new ConflictException('Username sudah digunakan');
    }
  
    // 3️⃣ Simpan user ke database
    console.log('Menyimpan user ke database');
    return this.userService.create(createUserDto);
  }
  
  
}
