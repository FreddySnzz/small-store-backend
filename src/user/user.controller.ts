import { Controller, Get } from '@nestjs/common';

import { UserService } from './user.service';
import { ReturnUserDto } from './dtos/return-user.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService
  ) {}

  @Get('/all')
  async findAll(): Promise<ReturnUserDto[]> {
    return (await this.userService.findAll()).map(
      (userEntity) => new ReturnUserDto(userEntity)
    );
  };
}
