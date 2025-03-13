import { Controller, Get } from '@nestjs/common';

import { UserService } from './user.service';
import { ReturnUserDto } from './dtos/return-user.dto';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from './enum/user-type.enum';

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
}
