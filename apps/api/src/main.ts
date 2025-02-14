import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  process.env.TZ = 'Asia/Jakarta';
  const app = await NestFactory.create(AppModule);

  // CORS konfigurasi lebih jelas
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:3000', // Ganti dengan URL frontend Anda
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization', // jika diperlukan
    credentials: true,  //Untuk mengirim cookies
  });

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }));

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();

