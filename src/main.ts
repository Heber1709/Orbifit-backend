import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS: SOLO TU FRONTEND (GitHub Pages)
  app.enableCors({
    origin: [
      'https://heber1709.github.io',           // CAMBIA ESTO
      'https://heber1709.github.io/orbifit-frontend', // O ESTO
      'http://localhost:3000'                 // Para desarrollo local
    ],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // PUERTO DINÁMICO (Render lo asigna)
  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`Backend corriendo en puerto: ${port}`);
  console.log(`URL producción: https://orbifit-backend.onrender.com`);
}
bootstrap();