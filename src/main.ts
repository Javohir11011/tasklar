import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Faqat DTO dagi maydonlarni qabul qiladi
      forbidNonWhitelisted: true, // DTO'da bo‘lmagan maydonlarni bloklaydi
      transform: true, // DTO'ni avtomatik ravishda kerakli formatga o‘tkazadi
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
  console.log('Server running port:', process.env.PORT);
}
bootstrap();
