import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class SignupDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  phonePrefix?: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  confirmPassword?: string;
}
