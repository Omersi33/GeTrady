import { IsEmail, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class RegisterDto {
  @Transform(({ value }) => String(value ?? '').trim().toLowerCase())
  @IsEmail()
  email!: string;

  @IsString()
  name!: string;

  @IsString()
  birth!: string;

  @Transform(({ value }) => String(value ?? '').trim())
  @IsString()
  @MinLength(6)
  password!: string;
}