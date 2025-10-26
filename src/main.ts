import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS: FRONTEND LOCAL y GitHub Pages
app.enableCors({
  origin: (origin, callback) => {
    if (!origin || /^https:\/\/heber1709\.github\.io/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS no permitido'));
    }
  },
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
