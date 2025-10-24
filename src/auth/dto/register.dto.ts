import { IsEmail, IsString, MinLength, IsOptional, IsEnum, IsNumber, Min, Max } from 'class-validator';
import { PlayerPosition } from '@prisma/client';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  username: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsNumber()
  @Min(16)
  @Max(50)
  age?: number;

  @IsOptional()
  @IsEnum(PlayerPosition)
  position?: PlayerPosition;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsNumber()
  jerseyNumber?: number;
}