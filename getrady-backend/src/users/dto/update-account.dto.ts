import { IsEmail, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateAccountDto {
  @IsOptional()
  @Transform(({ value }) => value?.toString().trim())
  @IsString()
  name?: string;

  @IsOptional()
  @Transform(({ value }) => value?.toString().trim())
  birth?: string;

  @IsOptional()
  @Transform(({ value }) => value?.toString().trim().toLowerCase())
  @IsEmail()
  email?: string;
}