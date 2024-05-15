import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  const logger = new Logger('Main') // esto es para como se ve la terminal lo de app corriendo en el puerto xxxxx  


  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );


  await app.listen(envs.port);
  logger.log(`app corriendo en el puerto ${envs.port}`);

}
bootstrap();
