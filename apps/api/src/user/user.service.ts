import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    console.log('Menerima data untuk dibuat di UserService:', createUserDto); // ✅ Debug
  
    const { password, ...user } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    console.log('Password setelah di-hash:', hashedPassword); // ✅ Debug
    
    const newUser = await this.prisma.user.create({
      data: {
        password: hashedPassword,
        ...user,
      },
    });
  
    console.log('User berhasil dibuat:', newUser); // ✅ Debug
    return newUser;
  }
  

  async findByNIK(nik: number) {
    return this.prisma.user.findUnique({
      where: { nik },
    });
  }

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }
}
