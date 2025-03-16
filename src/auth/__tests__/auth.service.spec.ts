import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import { NotFoundException } from "@nestjs/common";

import { AuthService } from "../auth.service";
import { UserService } from "../../user/user.service";
import { userEntityMock } from "../../user/__mocks__/user.mock";
import { jwtMock } from "../__mocks__/jwt.mock";
import { loginUserMock } from "../__mocks__/login-user.mock";

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findUserByEmail: jest.fn().mockResolvedValue(userEntityMock),
            updateUserRecoveryToken: jest.fn().mockResolvedValue(userEntityMock),
          }
        },
        {
          provide: JwtService,
          useValue: {
            sign: () => jwtMock,
          }
        }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers(); 
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('Login', () => {
    it('should return user if email and password are valid', async () => {
      const user = await service.login(loginUserMock);
  
      expect(user).toEqual({
        accessToken: jwtMock,
        email: userEntityMock.email,
        role: userEntityMock.userType === 2 ? "User" : "Admin"
      });
    });
  
    it('should return error in UserService', async () => {
      jest.spyOn(userService, 'findUserByEmail').mockRejectedValueOnce(undefined);
  
      expect(service.login(loginUserMock)).rejects.toThrow();
    });
  
    it('should NotFoundException if email not exist', async () => {
      jest.spyOn(userService, 'findUserByEmail').mockResolvedValue(undefined);
  
      await expect(
        service.login(loginUserMock)
      ).rejects.toThrow(NotFoundException);
    });
  
    it('should throw NotFoundException if email is valid but password is incorrect', async () => {
      jest.spyOn(userService, 'findUserByEmail').mockResolvedValue(userEntityMock);
    
      await expect(
        service.login({ ...loginUserMock, password: 'wrongpassword' })
      ).rejects.toThrow(NotFoundException);
    });
    

    it('should handle error from findUserByEmail gracefully', async () => {
      jest.spyOn(userService, 'findUserByEmail').mockRejectedValueOnce(new Error('Database error'));
    
      await expect(service.login(loginUserMock)).rejects.toThrow(NotFoundException);
    });
  });

  describe('Get Recovery Token', () => {
    it('should return recovery token if user found', async () => {
      const userToken = await service.getRecoveryToken(loginUserMock.email);

      jest.advanceTimersByTime(3600000);
      expect(userService.updateUserRecoveryToken).toHaveBeenCalledTimes(2);
      expect(userService.updateUserRecoveryToken).toHaveBeenCalledWith(
        userEntityMock.email,
        userToken
      );
      expect(userService.updateUserRecoveryToken).toHaveBeenCalledWith(
        userEntityMock.email, 
        '0'
      );
    });
  
    it('should return error in UserService', async () => {
      jest.spyOn(userService, 'findUserByEmail').mockRejectedValueOnce(new Error('Database error'));
  
      expect(service.getRecoveryToken(loginUserMock.email)).rejects.toThrow(NotFoundException);
    });
  
    it('should throw NotFoundException if user does not exist', async () => {
      jest.spyOn(userService, 'findUserByEmail').mockResolvedValue(undefined);
    
      await expect(service.getRecoveryToken('invalid@email.com')).rejects.toThrow(NotFoundException);
    });
      
  });
});