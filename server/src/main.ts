import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './media/app.module';
import cors from "cors"
import "./cron"

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cors({
    origin: "*"
  }))

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      stopAtFirstError: true,
    })
  );

  await app.listen(3000);
}

bootstrap();