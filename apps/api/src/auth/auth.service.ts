import { ConflictException, Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';  // Gunakan bcrypt untuk verifikasi password

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly prisma: PrismaService, // Tambahkan PrismaService untuk validasi Karyawan
    private readonly jwtService: JwtService,  // Tambahkan JWT
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

  async validateLocalUser(username: string, password: string) {
    // 1️⃣ Cari user berdasarkan username
    const user = await this.userService.findByUsername(username);
    if (!user) throw new UnauthorizedException("User tidak ditemukan");

    // 2️⃣ Cek password dengan bcrypt.compare
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) throw new UnauthorizedException("Password Anda salah");

    try {
      // 3️⃣ Pastikan NIK adalah number
      const nik = Number(user.nik);
      if (isNaN(nik)) throw new UnauthorizedException("NIK tidak valid");

      // 4️⃣ Ambil data karyawan berdasarkan NIK
      const karyawan = await this.prisma.karyawan.findUnique({
        where: { nik }, // NIK dalam bentuk number
        select: { namaKaryawan: true, jabatan: true, status: true },
      });

      if (!karyawan) throw new UnauthorizedException("Data karyawan tidak ditemukan");

      // 5️⃣ Cek status karyawan (harus AKTIF)
      if (karyawan.status !== "AKTIF") {
        throw new UnauthorizedException("Akun Anda tidak aktif");
      }

      // 6️⃣ Return data untuk FE
      return {
        id: user.id,
        nik, // Tetap dalam format number
        name: karyawan.namaKaryawan,
        jabatan: karyawan.jabatan,
      };
      } catch (error) {
        throw new UnauthorizedException("Terjadi kesalahan saat mengambil data karyawan");
      }
  }

  async login(user: { id: number; nik: number; username: string }) {
    try {
      // 1️⃣ Pastikan NIK adalah number
      const nik = Number(user.nik);
      if (isNaN(nik)) throw new UnauthorizedException("NIK tidak valid");

      // 2️⃣ Ambil data karyawan berdasarkan NIK
      const karyawan = await this.prisma.karyawan.findUnique({
        where: { nik }, // NIK dalam bentuk number
        select: { namaKaryawan: true, jabatan: true },
      });

      if (!karyawan) {
        throw new UnauthorizedException("Karyawan tidak ditemukan");
      }

      // 3️⃣ Buat payload JWT
      const payload = {
        sub: user.id,
        nik, // Tetap sebagai number
        name: karyawan.namaKaryawan,
        jabatan: karyawan.jabatan,
      };

      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id: user.id,
          nik, // Tetap sebagai number
          name: karyawan.namaKaryawan,
          jabatan: karyawan.jabatan,
        },
      };
    } catch (error) {
      throw new UnauthorizedException("Terjadi kesalahan saat proses login");
    }
  }
}
