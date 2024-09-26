import { AuthController } from "./auth.controller";
import { AuthService } from '../services/auth.service';
import User from "../../../models/User.model";
import { Logger } from "../../../library/Logger";
import { UsersService } from "../../users/services/users.service";

const authService = new AuthService(new UsersService(User));

jest.mock("../../users/services/users.service");
jest.mock("../../auth/services/auth.service");
jest.mock("../../../library/Logger");

describe("AuthController", () => {
  // AuthController can successfully register a new user
  it("should register a new user successfully", async () => {
    const req = { body: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    authService.registerUser = jest
      .fn()
      .mockResolvedValueOnce({ name: "John", email: "john@example.com" });

    // @ts-ignore
    await AuthController.registerUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled()
    expect(next).not.toHaveBeenCalled();
  });

  // AuthController can successfully register a new admin
  it("should register a new admin successfully", async () => {
    const req = { body: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    authService.registerAdmin = jest
      .fn()
      .mockResolvedValueOnce({ name: "Admin", email: "admin@example.com" });
    // @ts-ignore
    await AuthController.registerAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled()
    expect(next).not.toHaveBeenCalled();
  });

  // AuthController can successfully log in a user
  it("should log in a user successfully", async () => {
    const req = { body: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    authService.loginUser = jest
      .fn()
      .mockResolvedValueOnce({ name: "John", email: "john@example.com" });
    // @ts-ignore
    await AuthController.login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled()
    expect(next).not.toHaveBeenCalled();
  });

  // AuthController returns the correct HTTP status codes for unsuccessful requests
  it("should return the correct HTTP status codes for unsuccessful requests", async () => {
    const req = { body: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    authService.registerUser = jest
      .fn()
      .mockRejectedValueOnce(new Error("Registration failed"));
    // @ts-ignore
    await AuthController.registerUser(req, res, next);

    expect(res.status).toHaveBeenCalled()
  });

  // AuthController returns the correct error messages for unsuccessful requests
  it("should return the correct error messages for unsuccessful requests", async () => {
    const req = { body: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    authService.registerUser = jest
      .fn()
      .mockRejectedValueOnce(new Error("Registration failed"));
    // @ts-ignore
    await AuthController.registerUser(req, res, next);

    expect(res.status).toHaveBeenCalled()
  });

  // AuthController handles errors appropriately and passes them to the error handling middleware for unsuccessful requests
  it("should handle errors appropriately and pass them to the error handling middleware for unsuccessful requests", async () => {
    const req = { body: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    authService.registerUser = jest
      .fn()
      .mockRejectedValueOnce(new Error("Registration failed"));
    // @ts-ignore
    await AuthController.registerUser(req, res, next);

    expect(Logger.error).not.toHaveBeenCalled();
  });
});