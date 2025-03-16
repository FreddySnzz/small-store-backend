import { 
  validatePassword, 
  createPasswordHashed 
} from '../password';
import { updatePasswordMock } from '../../user/__mocks__/update-password.mock';
import { recoveryPasswordMock } from '../../user/__mocks__/recovery-password.mock';

describe('Password Utilities', () => {
  describe('validatePassword', () => {
    it('should return true if the password matches the hash', async () => {
      const passwordHashed = await createPasswordHashed(recoveryPasswordMock.newPassword);

      const result = await validatePassword(recoveryPasswordMock.newPassword, passwordHashed);
      expect(result).toBe(true);
    });

    it('should return false if the password does not match the hash', async () => {
      const passwordHashed = await createPasswordHashed(recoveryPasswordMock.newPassword);

      const result = await validatePassword(updatePasswordMock.oldPassword, passwordHashed);
      expect(result).toBe(false);
    });
  });

  describe('createPasswordHashed', () => {
    it('should return a hashed password', async () => {
      const hashedPassword = await createPasswordHashed(recoveryPasswordMock.newPassword);

      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toEqual(updatePasswordMock.oldPassword);
    });
  });
});