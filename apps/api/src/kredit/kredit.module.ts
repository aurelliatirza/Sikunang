import { Module } from '@nestjs/common';
import { KreditService } from './kredit.service';
import { KreditController } from './kredit.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [KreditController],
  providers: [KreditService, PrismaService],
})
export class KreditModule {}
