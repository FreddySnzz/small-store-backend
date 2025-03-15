import { 
  BadRequestException,
  Injectable, 
  NotAcceptableException, 
  NotFoundException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { createPasswordHashed, validatePassword } from '../utils/password';
import { UserType } from './enum/user-type.enum';
import { RecoveryPasswordDto } from './dtos/recovery-password.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  };

  async findUserByEmail(
    email: string,
    enabledCondition?: boolean
  ): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { 
        email,
        enabled: enabledCondition
      }
    });

    if (!user) {
      throw new NotFoundException(`Email: ${email} not found`);
    };

    return user;
  };

  async findUserById(
    id: number
  ): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id }
    });

    if (!user) {
      throw new NotFoundException(`UserID ${id} not found`);
    };

    return user;
  };

  async findUserByRecoveryToken(
    token: string
  ): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { token }
    });

    if (!user) {
      throw new BadRequestException(`Token invalid`);
    };

    return user;
  };

  async createUser(
    createUserDto: CreateUserDto
  ): Promise<UserEntity> {
    const user = await this.findUserByEmail(
      createUserDto.email
    ).catch(() => undefined);

    if (user) {
      throw new NotAcceptableException(`Email already exists`);
    }

    const passwordHashed = await createPasswordHashed(createUserDto.password);

    return this.userRepository.save({
      ...createUserDto,
      user_type: UserType.User,
      password: passwordHashed,
      enabled: true
    });
  };

  async updateUserRecoveryToken(
    email: string,
    recoveryToken: string
  ): Promise<UserEntity> {
    const user = await this.findUserByEmail(email);

    return await this.userRepository.save({
      ...user,
      token: recoveryToken
    });
  };

  async recoveryPassword(
    recoveryPassword: RecoveryPasswordDto
  ): Promise<UserEntity> {
    const user = await this.findUserByRecoveryToken(recoveryPassword.token);

    const passwordCompare = await validatePassword(
      recoveryPassword.newPassword,
      user.password
    );

    if (passwordCompare) {
      throw new BadRequestException(`New password must be different from the old one`);
    };

    const passwordHashed = await createPasswordHashed(recoveryPassword.newPassword);

    return await this.userRepository.save({
      ...user,
      password: passwordHashed,
      token: '0'
    });
  };

  async updatePassword(
    userId: number, 
    updatePasswordDto: UpdatePasswordDto
  ): Promise<UserEntity> {
    const user = await this.findUserById(userId);

    if (updatePasswordDto.newPassword === updatePasswordDto.oldPassword) {
      throw new BadRequestException(`Passwords cannot be the same`);
    };

    const isMatch = await validatePassword(updatePasswordDto.oldPassword, user.password);

    if (!isMatch) {
      throw new BadRequestException(`Passwords do not match`);
    };

    const passwordHashed = await createPasswordHashed(updatePasswordDto.newPassword);

    await this.userRepository.save({
      ...user,
      password: passwordHashed
    });

    return user;
  };

  async updateUser(
    userId: number, 
    updateUserDto: UpdateUserDto
  ): Promise<UserEntity> {
    const user = await this.findUserById(userId);

    await this.userRepository.save({
      ...user,
      ...updateUserDto
    });

    return user;
  };

  async disableUser(
    userId: number
  ): Promise<UserEntity> {
    const user = await this.findUserById(userId);

    return await this.userRepository.save({
      ...user,
      enabled: !user.enabled
    });
  };
}
