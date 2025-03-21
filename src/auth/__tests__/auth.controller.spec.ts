import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { loginUserMock } from '../__mocks__/login-user.mock';
import { returnLoginMock } from '../__mocks__/return-login.mock';
import { recoveryTokenMock } from '../__mocks__/recovery-token.mock';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn().mockResolvedValue(returnLoginMock),
            getRecoveryToken: jest.fn().mockResolvedValue(recoveryTokenMock),
          },
        },
      ],
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(authService).toBeDefined();
  });

  it('should return userLogin', async () => {
    const userLogin = await controller.login(loginUserMock);

    expect(userLogin).toEqual(returnLoginMock);
  });

  it('should return recovery token', async () => {
    const recoveryToken = await controller.getRecoveryToken(loginUserMock);

    expect(recoveryToken.token).toEqual(recoveryTokenMock);
  });
});