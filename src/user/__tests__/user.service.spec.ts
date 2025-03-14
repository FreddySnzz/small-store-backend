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

describe('UserService', () => {
  let service: UserService;
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
        }
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity)
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
  
    it('should return error in exception', async () => {
      jest.spyOn(userRepository, 'find').mockRejectedValueOnce(new Error());
      
      expect(service.findAll()).rejects.toThrow();
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
      const user = await service.updatePassword(userEntityMock.id, updatePasswordMock);
  
      expect(user).toEqual(userEntityMock);
    });

    it('should return error in invalid password', async () => {
      expect(service.updatePassword(userEntityMock.id, updateInvalidPasswordMock)).rejects.toThrow();
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
      const user = await service.disableUser(
        userEntityMock.id
      );
  
      expect(user.enabled).toEqual(true);
    });

    it('should return error in findUserById (error DB)', async () => {
      jest.spyOn(userRepository, 'findOne').mockRejectedValueOnce(new Error());
  
      expect(service.findUserById(userEntityMock.id)).rejects.toThrow();
    });
  });
});