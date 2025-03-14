import { Test, TestingModule } from '@nestjs/testing';

import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { userEntityMock } from '../__mocks__/user.mock';
import { createUserMock } from '../__mocks__/create-user.mock';
import { updatePasswordMock } from '../__mocks__/update-password.mock';
import { recoveryPasswordMock } from '../__mocks__/recovery-password.mock';
import { updateUserMock } from '../__mocks__/update-user.mock';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([userEntityMock]),
            findUserById: jest.fn().mockResolvedValue(userEntityMock),
            createUser: jest.fn().mockResolvedValue(userEntityMock),
            updatePassword: jest.fn().mockResolvedValue(userEntityMock),
            recoveryPassword: jest.fn().mockResolvedValue(userEntityMock),
            updateUser: jest.fn().mockResolvedValue(userEntityMock),
            disableUser: jest.fn().mockResolvedValue(userEntityMock),
          },
        },
      ],
      controllers: [UserController],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(userService).toBeDefined();
  });

  it('Get All Users', async () => {
    const user = await controller.findAll();

    expect(user).toEqual([{
      id: userEntityMock.id,
      email: userEntityMock.email,
      name: userEntityMock.name,
      phone: userEntityMock.phone,
      profile_image: userEntityMock.profile_image,
      enabled: userEntityMock.enabled,
      user_type: userEntityMock.user_type,
    }]);
  });

  it('Get User By ID', async () => {
    const user = await controller.findUserById(userEntityMock.id);

    expect(user).toEqual({
      id: userEntityMock.id,
      email: userEntityMock.email,
      name: userEntityMock.name,
      phone: userEntityMock.phone,
      profile_image: userEntityMock.profile_image,
      enabled: userEntityMock.enabled,
      user_type: userEntityMock.user_type,
    });
  });

  it('Create User', async () => {
    const user = await controller.createUser(createUserMock);

    expect(user).toEqual({
      id: userEntityMock.id,
      email: userEntityMock.email,
      name: userEntityMock.name,
      phone: userEntityMock.phone,
      profile_image: userEntityMock.profile_image,
      enabled: userEntityMock.enabled,
      user_type: userEntityMock.user_type,
    });
  });

  it('Recovery Password', async () => {
    const user = await controller.recoveryPassword(recoveryPasswordMock);

    expect(user).toEqual({
      id: userEntityMock.id,
      email: userEntityMock.email,
      name: userEntityMock.name,
      phone: userEntityMock.phone,
      profile_image: userEntityMock.profile_image,
      enabled: userEntityMock.enabled,
      user_type: userEntityMock.user_type,
    });
  });

  it('Update Password', async () => {
    const user = await controller.updatePassword(
      userEntityMock.id, 
      updatePasswordMock
    );

    expect(user).toEqual({
      id: userEntityMock.id,
      email: userEntityMock.email,
      name: userEntityMock.name,
      phone: userEntityMock.phone,
      profile_image: userEntityMock.profile_image,
      enabled: userEntityMock.enabled,
      user_type: userEntityMock.user_type,
    });
  });

  it('Update User', async () => {
    const user = await controller.updateUser(
      userEntityMock.id, 
      updateUserMock
    );

    expect(user).toEqual({
      id: userEntityMock.id,
      email: userEntityMock.email,
      name: userEntityMock.name,
      phone: userEntityMock.phone,
      profile_image: userEntityMock.profile_image,
      enabled: userEntityMock.enabled,
      user_type: userEntityMock.user_type,
    });
  });

  it('Enable/Disable User By ID', async () => {
    const user = await controller.disableUser(
      userEntityMock.id,
    );

    expect(user).toEqual({
      id: userEntityMock.id,
      email: userEntityMock.email,
      name: userEntityMock.name,
      phone: userEntityMock.phone,
      profile_image: userEntityMock.profile_image,
      enabled: userEntityMock.enabled,
      user_type: userEntityMock.user_type,
    });
  });
});