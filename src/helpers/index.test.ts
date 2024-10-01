import {
  createToken,
  getCelebrateErrorMessage,
  AppError,
} from './index';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';

describe('AppError', () => {
  it('should create an error with the correct properties', () => {
    const error = new AppError(404, 'Not Found', {
      detail: 'Resource not found',
    });
    expect(error.code).toBe(404);
    expect(error.message).toBe('Not Found');
    expect(error.status).toBe('fail');
    expect(error.error).toEqual({ detail: 'Resource not found' });
  });

  it('should set status to error for 500 status code', () => {
    const error = new AppError(500, 'Internal Server Error');
    expect(error.status).toBe('error');
  });
});

describe('createToken', () => {
  it('should create a valid JWT token', () => {
    const payload = { id: 1, name: 'John Doe' };
    const token = createToken(payload);
    const decoded = jwt.verify(token, config.jwt.secret);
    expect(decoded).toMatchObject(payload);
  });

  it('should throw an error for invalid secret', () => {
    const payload = { id: 1, name: 'John Doe' };
    const token = createToken(payload);
    expect(() => jwt.verify(token, 'invalid_secret')).toThrow();
  });
});

describe('getCelebrateErrorMessage', () => {
  it('should return the correct error message', () => {
    const err = {
      details: new Map([
        ['body', { details: [{ message: '"name" is required' }] }],
      ]),
    };
    const message = getCelebrateErrorMessage(err);
    expect(message).toBe('name is required');
  });

  it('should return undefined if no details are present', () => {
    const err = {};
    const message = getCelebrateErrorMessage(err);
    expect(message).toBeUndefined();
  });
});
