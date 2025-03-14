import { Injectable, NotFoundException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../user/user.service';
import { LoginDto } from './dtos/login.dto';
import { UserEntity } from '../user/entities/user.entity';
import { ReturnLoginDto } from './dtos/return-login.dto';
import { LoginPayloadDto } from './dtos/login-payload.dto';
import { generateToken } from '../utils/generate-recovery-token';
import { TokenExpiresIn } from './enum/token-expiration-time.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) {}

  async login(loginDto: LoginDto): Promise<ReturnLoginDto> {
    const user: UserEntity | undefined = await this.userService
      .findUserByEmail(loginDto.email)
      .catch(() => undefined);

    const isMatch = await compare(loginDto.password, user?.password || '');

    if (!isMatch || !user) {
      throw new NotFoundException('Email or password invalid');
    };

    return {
      accessToken: this.jwtService.sign({ ...new LoginPayloadDto(user) }),
      ...new ReturnLoginDto(user),
    };
  };

  async getRecoveryToken(email: string): Promise<any> {
    const user: UserEntity | undefined = await this.userService
      .findUserByEmail(email)
      .catch(() => undefined);

    if (!user) {
      throw new NotFoundException('Email invalid');
    };
    
    const token = generateToken().toString();

    await this.userService.updateUserRecoveryToken(
      user.email, 
      token
    );

    setTimeout(async () => {
      await this.userService.updateUserRecoveryToken(
        user.email, 
        '0'
      );
    }, TokenExpiresIn['30min']);
    
    return token;
  };
}