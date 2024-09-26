import { AppError, createToken } from '../../../helpers';
import { LoginUserType, RegisterUserType } from '../../../types';
import { UsersService } from '../../users/services/users.service';
import bcrypt from 'bcrypt';

export class AuthService {
  constructor(private userService: UsersService) {}
  async registerUser(payload: RegisterUserType) {
    // check if user with email already exists
    const userExists = await this.userService.getUserByEmail(
      payload.email,
    );

    if (userExists) {
      throw new AppError(
        400,
        `User with email ${payload.email} already exists`,
      );
    }

    return await this.userService.createUser(payload);
  }

  async registerAdmin(payload: RegisterUserType) {
    return await this.userService.createAdmin(payload);
  }

  async loginUser(payload: LoginUserType) {
    const { email, password } = payload;
    const user = await this.userService.getUserByEmail(email);
    const isPasswordValid =
      user && (await bcrypt.compare(password, user.password));

    if (!isPasswordValid) {
      throw new AppError(401, `Invalid email or password`);
    }

    const access_token = createToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return { access_token };
  }
}
