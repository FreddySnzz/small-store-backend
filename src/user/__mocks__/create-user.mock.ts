import { CreateUserDto } from "../dtos/create-user.dto";

export const createUserMock: CreateUserDto = {
  name: 'Create User Test',
  email: 'createuser@mail.com',
  phone: '12345678910',
  password: 'largePassword',
}