import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';

async function bootstrap() {
  process.env.TZ = 'Asia/Jakarta';
  const app = await NestFactory.create(AppModule);

  // CORS konfigurasi lebih jelas
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:3000', // Ganti dengan URL frontend Anda
    methods: 'GET,POST,PUT,DELETE, PATCH',
    allowedHeaders: 'Content-Type, Accept, Authorization', // jika diperlukan
    credentials: true,  //Untuk mengirim cookies
  });

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }));

  // **Menyajikan folder sebagai static file**
  app.use('/uploads', express.static('/Users/tirzaaurellia/Documents/Foto Test Sikunang'));

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();

