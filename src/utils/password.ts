import { compare, hash } from 'bcrypt';

export const validatePassword = async (
  password: string,
  passwordHashed: string
): Promise<boolean> => {
  return compare(password, passwordHashed || '');
};

export const createPasswordHashed = async(
  password: string
): Promise<string> => {
  const saltOrRounds = 10;

  return hash(password, saltOrRounds);
};