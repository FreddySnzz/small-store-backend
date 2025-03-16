import { LoginPayloadDto } from '../auth/dtos/login-payload.dto';

export const authorizationToLoginPayload = (
  authorization: string,
): LoginPayloadDto | undefined => {
  const authorizationSplited = authorization.split('.');

  if (authorizationSplited.length < 2 || !authorizationSplited[1]) {
    return undefined;
  }

  try {
    return JSON.parse(
      Buffer.from(authorizationSplited[1], 'base64').toString('ascii'),
    );
  } catch (error) {
    return undefined;
  }
};