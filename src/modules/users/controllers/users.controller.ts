import { NextFunction, Request, Response } from "express";
import { UsersService } from "./../services/users.service";
import { Logger } from "../../../library/Logger";
import User from "../../../models/User.model";

const userService = new UsersService(User);

export class UsersController {
  static async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getAllUsers();
      return res
        .status(200)
        .json({ message: "Users fetched successfully", data: users });
    } catch (error) {
      Logger.error(error);
      next(error)
    }
  }

  static async getAdmins(req: Request, res: Response, next: NextFunction) {
    try {
      const admins = await userService.getAdmins();
      return res
        .status(200)
        .json({ message: "Admins fetched successfully", data: admins });
    } catch (error) {
      Logger.error(error);
      next(error)
    }
  }
}
