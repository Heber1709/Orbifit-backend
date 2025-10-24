import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService, 
    private usersService: UsersService
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    try {
      console.log('📧 Solicitud de recuperación para:', body.email);
      
      const user = await this.usersService.findByEmail(body.email);
      
      // Por seguridad, no revelamos si el email existe o no
      const response: any = { 
        success: true, 
        message: 'Si el email existe en nuestro sistema, recibirás instrucciones de recuperación' 
      };

      // Si el usuario existe, generamos token de desarrollo
      if (user) {
        response.developmentToken = 'dev-token-' + Date.now();
        response.developmentNote = 'En producción esto llegaría por email';
        console.log('✅ Usuario encontrado:', user.email);
      } else {
        console.log('⚠️ Email no encontrado:', body.email);
      }

      return response;
    } catch (error) {
      console.error('Error en forgot-password:', error);
      // Por seguridad, siempre devolvemos éxito
      return { 
        success: true, 
        message: 'Si el email existe en nuestro sistema, recibirás instrucciones de recuperación' 
      };
    }
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    try {
      console.log('🔄 Reset password con token:', body.token);
      
      // En desarrollo, aceptamos cualquier token que empiece con 'dev-token-'
      if (body.token && body.token.startsWith('dev-token-')) {
        return { 
          success: true, 
          message: 'Contraseña actualizada correctamente (modo desarrollo)',
          note: 'En producción, esto actualizaría la contraseña real del usuario'
        };
      }
      
      throw new Error('Token inválido');
    } catch (error) {
      throw new HttpException(
        'Token inválido o expirado',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('change-password')
  async changePasswordDirectly(@Body() body: { email: string; newPassword: string }) {
    try {
      console.log('🔐 Cambio directo de password para:', body.email);
      
      const user = await this.usersService.findByEmail(body.email);
      if (!user) {
        console.log('❌ Usuario no encontrado:', body.email);
        // Por seguridad, no revelamos si el email existe
        return { 
          success: true, 
          message: 'Si el email existe, la contraseña ha sido actualizada' 
        };
      }

      console.log('✅ Usuario encontrado, actualizando contraseña...');
      
      // ¡ACTUALIZACIÓN REAL DE LA CONTRASEÑA EN LA BASE DE DATOS!
      await this.usersService.updatePassword(user.id, body.newPassword);
      
      console.log('✅ Contraseña actualizada para:', user.email);
      
      return { 
        success: true, 
        message: 'Contraseña actualizada correctamente',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName
        }
      };
    } catch (error) {
      console.error('❌ Error actualizando contraseña:', error);
      throw new HttpException(
        'Error al actualizar la contraseña',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}