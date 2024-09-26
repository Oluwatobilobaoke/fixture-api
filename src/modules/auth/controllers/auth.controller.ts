import { NextFunction, Request, Response } from "express";
import { AuthService } from '../services/auth.service';
import { Logger } from "../../../library/Logger";
import {
  CreateUserDto,
  LoginUserDto,
} from '../../users/dtos/CreateUserDto.dto';
import User from "../../../models/User.model";
import { UsersService } from "../../users/services/users.service";

const userService = new UsersService(User);
const authService = new AuthService(userService);

export class AuthController {
  static async registerUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.registerUser(req.body);
      return res
        .status(201)
        .json({ message: "User created successfully", data: user });
    } catch (error) {
      Logger.error(error);
      next(error);
    }
  }

  static async registerAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const payload: CreateUserDto = req.body;
      const user = await authService.registerAdmin(payload);
      return res
        .status(201)
        .json({ message: "Admin created successfully", data: user });
    } catch (error) {
      Logger.error(error);
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const payload: LoginUserDto = req.body;
      const user = await authService.loginUser(payload);
      return res
        .status(200)
        .json({ message: "User logged in successfully", data: user });
    } catch (error) {
      Logger.error(error);
      next(error);
    }
  }
}
