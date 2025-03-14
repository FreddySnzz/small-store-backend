import { IsString } from 'class-validator';

export class RecoveryPasswordDto {
  @IsString()
  token: string;

  @IsString()
  newPassword: string;
}