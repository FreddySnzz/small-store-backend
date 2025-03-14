import { 
  Body, 
  Controller, 
  Post, 
  UsePipes, 
  ValidationPipe 
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { ReturnLoginDto } from './dtos/return-login.dto';
import { ReturnRecoveryTokenDto } from './dtos/return-recovery-token.dto';

@Controller('auth')
export class AuthController {
  constructor (
    private readonly authService: AuthService
  ) {}

  @UsePipes(ValidationPipe)
  @Post()
  async login(
    @Body() loginDto: LoginDto
  ): Promise<ReturnLoginDto> {
    return this.authService.login(loginDto);
  };

  @Post('/get-recovery-token')
  async getRecoveryToken(
    @Body() userEmail: LoginDto
  ): Promise<ReturnRecoveryTokenDto> {
    return new ReturnRecoveryTokenDto(
      await this.authService.getRecoveryToken(userEmail.email)
    );
  };
}
