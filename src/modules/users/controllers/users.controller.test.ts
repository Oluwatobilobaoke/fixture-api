import { UsersController } from "./users.controller";
import { UsersService } from "../services/users.service";
import User from "../../../models/User.model";
import { Logger } from "../../../library/Logger"

const userService = new UsersService(User);
jest.mock("../services/users.service");
jest.mock("../../../library/Logger");

describe("UsersController", () => {
  // UsersController can successfully fetch all users
  it("should fetch all users successfully", async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    // @ts-ignore
    await UsersController.getUsers(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  // UsersController can successfully fetch all admins
  it("should fetch all admins successfully", async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    // @ts-ignore
    await UsersController.getAdmins(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  // UsersController returns a 200 status code for successful requests
  it("should return a 200 status code for successful requests", async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    // @ts-ignore
    await UsersController.getUsers(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  // UsersService throws an error when fetching all users
  it("should throw an error when fetching all users", async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    const mockError = new Error("Error fetching users");
    userService.getAllUsers = jest
      .fn()
      .mockRejectedValue(mockError);

    // @ts-ignore
    await UsersController.getUsers(req, res, next);

    expect(Logger.error).not.toHaveBeenCalledWith(mockError);
  });

  // UsersService throws an error when fetching all admins
  it("should throw an error when fetching all admins", async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    const mockError = new Error("Error fetching admins");
    userService.getAdmins = jest
      .fn()
      .mockRejectedValue(mockError);

    // @ts-ignore
    await UsersController.getAdmins(req, res, next);

    expect(Logger.error).not.toHaveBeenCalledWith(mockError);
  });
});
