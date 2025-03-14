import { 
  Body,
  Controller, 
  Get, 
  Param, 
  Patch, 
  Post, 
  Put, 
  UsePipes, 
  ValidationPipe 
} from '@nestjs/common';

import { UserService } from './user.service';
import { ReturnUserDto } from './dtos/return-user.dto';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from './enum/user-type.enum';
import { CreateUserDto } from './dtos/create-user.dto';
import { RecoveryPasswordDto } from './dtos/recovery-password.dto';
import { UserId } from '../decorators/user-id.decorator';
import { UpdateUserDto } from './dtos/update-user.dto';
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

  @Roles(UserType.Admin, UserType.User)
  @Get('/:userId')
  async findUserById(
    @Param('userId') userId: number
  ): Promise<ReturnUserDto> {
    return new ReturnUserDto(
      await this.userService.findUserById(userId)
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

  @Roles(UserType.Admin, UserType.User)
  @UsePipes(ValidationPipe)
  @Put('/update-user')
  async updateUser(
    @UserId() userId: number,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<ReturnUserDto> {
    return new ReturnUserDto(
      await this.userService.updateUser(
        userId, 
        updateUserDto
      )
    );
  };

  @UsePipes(ValidationPipe)
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

  @Roles(UserType.Admin)
  @Get('/disable/:userId')
  async disableUser(
    @Param('userId') userId: number
  ): Promise<ReturnUserDto> {
    return new ReturnUserDto(
      await this.userService.disableUser(userId)
    );
  };
}
