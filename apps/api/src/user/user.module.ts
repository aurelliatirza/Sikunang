import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from '../prisma/prisma.module';  // ✅ Impor PrismaModule

@Module({
  imports: [PrismaModule],  // ✅ Pastikan PrismaModule di dalam imports
  controllers: [UserController],  // ✅ Hanya controller yang masuk sini
  providers: [UserService],  // ✅ Provider hanya untuk service
  exports: [UserService], // (Opsional) Jika UserService akan digunakan di module lain
})
export class UserModule {}
