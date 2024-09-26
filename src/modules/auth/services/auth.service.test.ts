import User from '../../../models/User.model';
import { RegisterUserType } from '../../../types';
import { UsersService } from '../../users/services/users.service';
import { AuthService } from './auth.service';
import bcrypt from 'bcrypt';

const userRepository = User;
jest.mock('../../users/services/users.service');

describe('AuthService', () => {
  beforeEach(() => jest.clearAllMocks());
  // AuthService can register a user successfully
  it('should register a user successfully', async () => {
    // Arrange
    const payload: RegisterUserType = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password123',
    };

    // @ts-ignore
    const userService = new UsersService(userRepository);
    const authService = new AuthService(userService);

    // Act
    userService.createUser = jest.fn().mockResolvedValue(payload);
    const result = await authService.registerUser(payload);

    // Assert
    expect(result).toBeDefined();
    expect(result.name).toBe(payload.name);
    expect(result.email).toBe(payload.email);
    expect(result.password).toBeDefined();
  });

  // AuthService can register an admin successfully
  it('should register an admin successfully', async () => {
    // Arrange
    const payload: RegisterUserType = {
      name: 'Admin',
      email: 'admin@example.com',
      password: 'admin123',
    };
    // @ts-ignore
    const userService = new UsersService(userRepository);
    const authService = new AuthService(userService);
    userService.createAdmin = jest
      .fn()
      .mockResolvedValue({ ...payload, role: 'admin' });

    // Act
    const result = await authService.registerAdmin(payload);

    // Assert
    expect(result).toBeDefined();
    expect(result.name).toBe(payload.name);
    expect(result.email).toBe(payload.email);
    expect(result.password).toBeDefined();
    expect(result.role).toBe('admin');
  });

  // AuthService can login a user successfully
  it('should login a user successfully', async () => {
    // Arrange
    const email = 'johndoe@example.com';
    const password = 'password123';
    const user = {
      id: '1',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'user',
    };
    // @ts-ignore
    const userService = new UsersService(userRepository);
    userService.getUserByEmail = jest.fn().mockResolvedValue(user);
    const authService = new AuthService(userService);

    // Act
    const result = await authService.loginUser({ email, password });

    // Assert
    expect(result).toBeDefined();
    expect(result.access_token).toBeDefined();
  });

  // AuthService throws an error when registering a user with an existing email
  it('should throw an error when registering a user with an existing email', async () => {
    // Arrange
    const payload: RegisterUserType = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password123',
    };
    // @ts-ignore
    const userService = new UsersService(userRepository);
    userService.createUser = jest
      .fn()
      .mockRejectedValue(new Error('Email already exists'));
    const authService = new AuthService(userService);

    // Act and Assert
    await expect(authService.registerUser(payload)).rejects.toThrow(
      'Email already exists',
    );
  });

  // AuthService throws an error when registering an admin with an existing email
  it('should throw an error when registering an admin with an existing email', async () => {
    // Arrange
    const payload: RegisterUserType = {
      name: 'Admin',
      email: 'admin@example.com',
      password: 'admin123',
    };
    // @ts-ignore
    const userService = new UsersService(userRepository);
    userService.createAdmin = jest
      .fn()
      .mockRejectedValue(new Error('Email already exists'));
    const authService = new AuthService(userService);

    // Act and Assert
    await expect(authService.registerAdmin(payload)).rejects.toThrow(
      'Email already exists',
    );
  });

  // AuthService throws an error when logging in with an invalid email
  it('should throw an error when logging in with an invalid email', async () => {
    // Arrange
    const email = 'invalid@example.com';
    const password = 'password123';
    // @ts-ignore
    const userService = new UsersService(userRepository);
    userService.getUserByEmail = jest.fn().mockResolvedValue(null);
    const authService = new AuthService(userService);

    // Act and Assert
    await expect(
      authService.loginUser({ email, password }),
    ).rejects.toThrow('Invalid email or password');
  });
});
