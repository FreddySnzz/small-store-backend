import { Repository } from "typeorm";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { 
  BadRequestException, 
  NotAcceptableException, 
  NotFoundException 
} from "@nestjs/common";

import { UserEntity } from "../entities/user.entity";
import { UserService } from "../user.service";
import { userEntityMock } from "../__mocks__/user.mock";
import { createUserMock } from "../__mocks__/create-user.mock";
import { 
  updatePasswordMock, 
  updateInvalidPasswordMock 
} from "../__mocks__/update-password.mock";
import { recoveryTokenMock } from "../../auth/__mocks__/recovery-token.mock";
import { loginUserMock } from "../../auth/__mocks__/login-user.mock";
import { CacheService } from "../../cache/cache.service";
import { recoveryPasswordMock } from "../__mocks__/recovery-password.mock";
import { updateUserMock } from "../__mocks__/update-user.mock";
import * as passwordUtils from '../../utils/password';

jest.mock('../../utils/password.ts', () => ({
  validatePassword: jest.fn(),
  createPasswordHashed: jest.fn(),
}));

describe('UserService', () => {
  let service: UserService;
  let cacheService: CacheService;
  let userRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            find: jest.fn().mockResolvedValue([userEntityMock]),
            findOne: jest.fn().mockResolvedValue(userEntityMock),
            save: jest.fn().mockResolvedValue(userEntityMock),
          }
        },
        {
          provide: CacheService,
          useValue: {
            getCache: jest.fn().mockResolvedValue([userEntityMock]),
          }
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    cacheService = module.get<CacheService>(CacheService);
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity)
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(cacheService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('Find user by email', () => {
    it('should return user in findUserByEmail', async () => {
      const user = await service.findUserByEmail(userEntityMock.email);
      const spy = jest.spyOn(userRepository, 'findOne').mockResolvedValue(userEntityMock);
  
      expect(user).toEqual(userEntityMock);
      expect(spy.mock.calls[0][0]).toEqual({ 
        where: { email: userEntityMock.email } 
      });
    });
  
    it('should return error in findUserByEmail', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

      expect(service.findUserByEmail(userEntityMock.email)).rejects.toThrow(NotFoundException);
    });
  
    it('should return error in findUserByEmail (error DB)', async () => {
      jest.spyOn(userRepository, 'findOne').mockRejectedValueOnce(new Error());
  
      expect(service.findUserByEmail(userEntityMock.email)).rejects.toThrow();
    });
  });

  describe('Find user by id', () => {
    it('should return user in findUserById', async () => {
      const user = await service.findUserById(userEntityMock.id);
      const spy = jest.spyOn(userRepository, 'findOne').mockResolvedValue(userEntityMock);
  
      expect(user).toEqual(userEntityMock);
      expect(spy.mock.calls[0][0]).toEqual({ 
        where: { id: userEntityMock.id } 
      });
    });
  
    it('should return error in findUserById', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

      expect(service.findUserById(userEntityMock.id)).rejects.toThrow(NotFoundException);
    });
  
    it('should return error in findUserById (error DB)', async () => {
      jest.spyOn(userRepository, 'findOne').mockRejectedValueOnce(new Error());
  
      expect(service.findUserById(userEntityMock.id)).rejects.toThrow();
    });
  });

  describe('Find user by token', () => {
    it('should return user in findUserByRecoveryToken', async () => {
      const user = await service.findUserByRecoveryToken(recoveryTokenMock.token);
      const spy = jest.spyOn(userRepository, 'findOne').mockResolvedValue(userEntityMock);
  
      expect(user).toEqual(userEntityMock);
      expect(spy.mock.calls[0][0]).toEqual({ 
        where: { token: recoveryTokenMock.token } 
      });
    });
  
    it('should return error in findUserByRecoveryToken', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

      expect(service.findUserByRecoveryToken(recoveryTokenMock.token)).rejects.toThrow(BadRequestException);
    });
  
    it('should return error in findUserByRecoveryToken (error DB)', async () => {
      jest.spyOn(userRepository, 'findOne').mockRejectedValueOnce(new Error());
  
      expect(service.findUserByRecoveryToken(recoveryTokenMock.token)).rejects.toThrow();
    });
  });

  describe('Find all users', () => {
    it('should return all users', async () => {
      const users = await service.findAll();
  
      expect(users).toEqual([userEntityMock]);
    });

    it('should return cached users if available', async () => {
      const cachedUsers: UserEntity[] = [userEntityMock];
      
      jest.spyOn(cacheService, 'getCache').mockResolvedValue(cachedUsers);
  
      const result = await service.findAll();
      
      expect(result).toEqual(cachedUsers);
      expect(cacheService.getCache).toHaveBeenCalledWith('users_all', expect.any(Function));
      expect(userRepository.find).not.toHaveBeenCalled();
    });
  
    it('should fetch users from the database if not in cache', async () => {
      const dbUsers: UserEntity[] = [userEntityMock];
      
      jest.spyOn(cacheService, 'getCache').mockImplementation((key, callback) => callback());
      jest.spyOn(userRepository, 'find').mockResolvedValue(dbUsers);
  
      const result = await service.findAll();

      expect(result).toEqual(dbUsers);
      expect(cacheService.getCache).toHaveBeenCalledWith('users_all', expect.any(Function));
      expect(userRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('Create user', () => {
    it('should return error if user already exists in createUser', async () => {
      expect(service.createUser(createUserMock)).rejects.toThrow(NotAcceptableException);
    });
  
    it('should return user in createUser', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);
  
      const user = await service.createUser(createUserMock);
  
      expect(user).toEqual(userEntityMock);
    });
  });

  describe('Update user password', () => {
    it('should return password updated', async () => {
      (passwordUtils.validatePassword as jest.Mock).mockResolvedValue(true);
      (passwordUtils.createPasswordHashed as jest.Mock).mockResolvedValue(updatePasswordMock.newPassword);

      const user = await service.updatePassword(userEntityMock.id, updatePasswordMock);
  
      expect(user).toEqual(userEntityMock);
      expect(passwordUtils.validatePassword).toHaveBeenCalledWith(
        updatePasswordMock.oldPassword, 
        userEntityMock.password
      );
      expect(passwordUtils.createPasswordHashed).toHaveBeenCalledWith(recoveryPasswordMock.newPassword);
      expect(userRepository.save).toHaveBeenCalledWith({
        ...userEntityMock,
        password: recoveryPasswordMock.newPassword
      });
    });

    it('should throw an error if the new password is the same as the old one', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(userEntityMock);
  
      await expect(service.updatePassword(
        userEntityMock.id, 
        {
          oldPassword: userEntityMock.password,
          newPassword: userEntityMock.password
        }
      )).rejects.toThrow(new BadRequestException('Passwords cannot be the same'));
    });

    it('should throw an error if the old password does not match', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(userEntityMock);
      (passwordUtils.validatePassword as jest.Mock).mockResolvedValue(false);
  
      await expect(service.updatePassword(
        userEntityMock.id, 
        updatePasswordMock
      )).rejects.toThrow(new BadRequestException('Passwords do not match'));
    });

    it('should return error if user not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined)

      expect(service.updatePassword(userEntityMock.id, updatePasswordMock)).rejects.toThrow();
    });
  });

  describe('Update user recovery token', () => {
    it('should return userEntity if recovery token has been updated', async () => {
      const user = await service.updateUserRecoveryToken(
        loginUserMock.email, 
        recoveryTokenMock.token
      );
  
      expect(user).toEqual(userEntityMock);
    });

    it('should return error in findUserByEmail (error DB)', async () => {
      jest.spyOn(userRepository, 'findOne').mockRejectedValueOnce(new Error());
  
      expect(service.findUserByEmail(loginUserMock.email)).rejects.toThrow();
    });
  });

  describe('Enable/Disable user', () => {
    it('should return userEntity if user has been disabled', async () => {
      const user = await service.toggleEnableUser(
        userEntityMock.id
      );
  
      expect(user.enabled).toEqual(true);
    });

    it('should return error in findUserById (error DB)', async () => {
      jest.spyOn(userRepository, 'findOne').mockRejectedValueOnce(new Error());
  
      expect(service.findUserById(userEntityMock.id)).rejects.toThrow();
    });
  });

  describe('Recovery password', () => {
    it('should update the password and reset the token', async () => {
      const updatedUser = {
        ...userEntityMock,
        password: 'newPasswordHashed',
        token: '0',
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(userEntityMock);
      (passwordUtils.validatePassword as jest.Mock).mockResolvedValue(false);
      (passwordUtils.createPasswordHashed as jest.Mock).mockResolvedValue(updatePasswordMock.newPassword);
      jest.spyOn(userRepository, 'save').mockResolvedValue(updatedUser as UserEntity);
  
      const result = await service.recoveryPassword(recoveryPasswordMock);

      expect(result).toEqual(updatedUser);
      expect(userRepository.findOne).toHaveBeenCalledWith({ 
        where: { token: userEntityMock.token } 
      });
      expect(passwordUtils.validatePassword).toHaveBeenCalledWith(
        recoveryPasswordMock.newPassword, 
        userEntityMock.password
      );
      expect(passwordUtils.createPasswordHashed).toHaveBeenCalledWith(recoveryPasswordMock.newPassword);
      expect(userRepository.save).toHaveBeenCalledWith({
        ...userEntityMock,
        password: recoveryPasswordMock.newPassword,
        token: '0',
      });
    });

    it('should throw an error if the new password is the same as the old one', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(userEntityMock);
      (passwordUtils.validatePassword as jest.Mock).mockResolvedValue(true);
  
      await expect(service.recoveryPassword(recoveryPasswordMock)).rejects.toThrow(
        new BadRequestException('New password must be different from the old one'),
      );
    });
  });

  describe('Update user', () => {
    it('should return userEntity after update user', async () => {
      const user = await service.updateUser(userEntityMock.id, updateUserMock);
  
      expect(user).toEqual(userEntityMock);
    });
  });
});