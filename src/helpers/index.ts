import jwt from 'jsonwebtoken';
import { config } from '../config/config';

export class AppError extends Error {
  code: number;
  status: string;
  error: any;
  /**
   * Custom Error - Create custom error object
   * @param {number} code HTTP status code
   * @param {string} message Error message
   */
  constructor(code: number, message: string, error?: any) {
    super(message);
    this.code = code;
    this.status = code >= 400 && code < 500 ? 'fail' : 'error';
    this.error = error;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const createToken = (payload: any) => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: 8640000000000000 / 2 / 1000,
  });
};

export const getCelebrateErrorMessage = (err: any) => {
  return Array.from(
    err?.details?.values(),
    // @ts-ignore
  )?.[0]?.details?.[0]?.message?.replace(/\"/g, '');
};
