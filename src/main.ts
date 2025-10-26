import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS: FRONTEND LOCAL y GitHub Pages
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:3000',           // desarrollo local
        'https://heber1709.github.io'      // producción GitHub Pages
      ];
      // Si no hay origin (petición desde backend o Postman), permitir
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS no permitido'));
      }
    },
    credentials: true, // si usas cookies o autenticación
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
