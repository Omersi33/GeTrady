import { IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdatePasswordDto {
  @Transform(({ value }) => value?.toString().trim())
  @IsString()
  oldPassword!: string;

  @Transform(({ value }) => value?.toString().trim())
  @IsString()
  newPassword!: string;
}