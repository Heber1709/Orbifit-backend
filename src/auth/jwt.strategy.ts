import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    console.log('🔐 JWT Payload recibido:', payload);
    console.log('🔐 JWT sub (userId):', payload.sub);
    console.log('🔐 JWT email:', payload.email);
    console.log('🔐 JWT role:', payload.role);
    
    // Asegurar que el userId sea un número
    const userId = parseInt(payload.sub);
    console.log('🔐 userId convertido a número:', userId);
    
    return { 
      userId: userId, 
      email: payload.email, 
      role: payload.role 
    };
  }
}