
import { ReturnLoginDto } from '../dtos/return-login.dto';
import { loginUserMock } from './login-user.mock';
import { jwtMock } from './jwt.mock';

export const returnLoginMock: ReturnLoginDto = {
  accessToken: jwtMock,
  email: loginUserMock.email,
  role: "Admin"
};