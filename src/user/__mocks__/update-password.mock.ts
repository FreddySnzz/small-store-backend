import { UpdatePasswordDto } from "../dtos/update-password.dto";

export const updatePasswordMock: UpdatePasswordDto = {
  oldPassword: '1234',
  newPassword: 'newLargePassword'
}

export const updateInvalidPasswordMock: UpdatePasswordDto = {
  oldPassword: 'asdf1234',
  newPassword: 'newLargePassword'
}