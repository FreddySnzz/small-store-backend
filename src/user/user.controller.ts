import { 
  Body,
  Controller, 
  Get, 
  Patch, 
  Post, 
  UsePipes, 
  ValidationPipe 
} from '@nestjs/common';

import { UserService } from './user.service';
import { ReturnUserDto } from './dtos/return-user.dto';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from './enum/user-type.enum';
import { CreateUserDto } from './dtos/create-user.dto';
import { RecoveryPasswordDto } from './dtos/recovery-password.dto';
import { UserId } from 'src/decorators/user-id.decorator';
import { UpdatePasswordDto } from './dtos/update-password.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService
  ) {}

  @Roles(UserType.Admin)
  @Get('/all')
  async findAll(): Promise<ReturnUserDto[]> {
    return (await this.userService.findAll()).map(
      (userEntity) => new ReturnUserDto(userEntity)
    );
  };

  @UsePipes(ValidationPipe)
  @Post()
  async createUser(
    @Body() createUser: CreateUserDto
  ): Promise<ReturnUserDto> {
    return new ReturnUserDto(
      await this.userService.createUser(createUser)
    );
  };

  @UsePipes(ValidationPipe)
  @Post('/recovery-password')
  async recoveryPassword(
    @Body() recoveryPassword: RecoveryPasswordDto
  ): Promise<ReturnUserDto> {
    return new ReturnUserDto(
      await this.userService.recoveryPassword(
        recoveryPassword
      )
    );
  };

  @UsePipes(ValidationPipe)
  @Roles(UserType.Admin, UserType.User)
  @Patch('/update-password')
  async updatePassword(
    @UserId() userId: number,
    @Body() updatePasswordDto: UpdatePasswordDto
  ): Promise<ReturnUserDto> {
    return new ReturnUserDto(
      await this.userService.updatePassword(
        userId, 
        updatePasswordDto
      )
    );
  };
}
