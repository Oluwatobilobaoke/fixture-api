import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../helpers";
import { config } from "../config/config";

export const authenticate = async (
  req: Request,
  _: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers["authorization"] ?? "";
    const token: string = authHeader.substring(7);

    if (!authHeader?.startsWith("Bearer ") || !token)
      throw new AppError(401, "Authentication token required");
    (req as any).token = token;

    try {
      const res: any = jwt.verify(token, config.jwt.secret);
      (req as any).user = { id: res.id, email: res.email, role: res.role };
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
  next: NextFunction
): Promise<void> => {
  try {
    const user = (req as any).user;
    if (user.role !== "admin") {
      throw new AppError(403, "Unauthorized!");
    }
    next();
  } catch (err) {
    next(err);
  }
};

export const authenticateAndisAdmin = (req: Request, res: Response, next: NextFunction) => {
  authenticate(req, res, (authError) => {
    if (authError) {
      return next(authError);
    }

    isAdmin(req, res, next);
  });
};
