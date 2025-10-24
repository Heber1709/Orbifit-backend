import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  // Ruta raíz: evita 404 en la URL base
  @Get()
  root() {
    return {
      message: '¡OrbitFit Backend VIVO!',
      status: 'OK',
      health: '/health',
      timestamp: new Date().toISOString(),
    };
  }

  // Ruta de prueba
  @Get('health')
  health() {
    return {
      status: 'OK',
      message: 'Backend funcionando - SIN base de datos',
      timestamp: new Date().toISOString(),
    };
  }
}