import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

const logger = new Logger();

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: Number(process.env.PORT || 5000),
    },
  });

  await app.listen();

  logger.log(
    `User Service is listening on port ${process.env.PORT || 5000}`,
    'Initialization',
  );
}
bootstrap();
