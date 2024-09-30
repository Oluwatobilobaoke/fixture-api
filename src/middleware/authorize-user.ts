import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { AppError } from '../helpers';
import { config } from '../config/config';

export const authenticate = async (
  req: Request,
  _: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'] ?? '';
    const token: string = authHeader.substring(7);

    if (!authHeader?.startsWith('Bearer ') || !token)
      throw new AppError(401, 'Authentication token required');
    (req as any).token = token;

    try {
      const res: any = jwt.verify(token, config.jwt.secret);
      (req as any).user = {
        id: res.id,
        email: res.email,
        role: res.role,
      };
    } catch (err: any) {
      next(err);
    }
    next();
  } catch (err) {
    next(err);
  }
};
export const isAdmin = async (
  req: Request,
  _: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = (req as any).user;
    if (user.role !== 'admin') {
      throw new AppError(403, 'Unauthorized!');
    }
    next();
  } catch (err) {
    next(err);
  }
};

export const authenticateAndisAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  sessionAuth(req, res, (authError) => {
    if (authError) {
      return next(authError);
    }

    isAdmin(req, res, next);
  });
};

// Middleware to verify the JWT token from session
export const sessionAuth = (
  req: Request,
  _: Response,
  next: NextFunction,
) => {
  try {
    //@ts-ignore
    const token = req.session.jwt;

    if (!token) {
      throw new AppError(401, 'Unauthorized, please log in');
    }

    // Verify the JWT token
    try {
      const res: any = jwt.verify(token, config.jwt.secret);
      (req as any).user = {
        id: res.id,
        email: res.email,
        role: res.role,
      };
    } catch (err: any) {
      next(err);
    }
    next();
  } catch (error) {
    next(error);
  }
};
