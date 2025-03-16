import { authorizationToLoginPayload } from '../base-64-converter';
import { LoginPayloadDto } from '../../auth/dtos/login-payload.dto';

describe('authorizationToLoginPayload', () => {
  it('should return the payload if the authorization token is valid', () => {
    const payload: LoginPayloadDto = {
      id: 1,
      userType: 1,
    };

    const token = `header.${Buffer.from(JSON.stringify(payload)).toString('base64')}.signature`;
    const result = authorizationToLoginPayload(token);

    expect(result).toEqual(payload);
  });

  it('should return undefined if the authorization token is invalid (missing parts)', () => {
    const invalidToken = 'header';
    const result = authorizationToLoginPayload(invalidToken);

    expect(result).toBeUndefined();
  });

  it('should return undefined if the authorization token is invalid (empty payload)', () => {
    const invalidToken = 'header..signature';
    const result = authorizationToLoginPayload(invalidToken);

    expect(result).toBeUndefined();
  });

  it('should return undefined if the authorization token is invalid (malformed payload)', () => {
    const invalidToken = 'header.invalidPayload.signature';
    const result = authorizationToLoginPayload(invalidToken);

    expect(result).toBeUndefined();
  });
});