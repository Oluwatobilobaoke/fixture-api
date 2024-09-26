import { Model } from 'mongoose';
import { IUserModel } from '../../../models/User.model';
import { CreateUserDto } from '../dtos/CreateUserDto.dto';

export class UsersService {
  constructor(private userRepository: Model<IUserModel>) {}
  async createUser({ name, email, password }: CreateUserDto) {
    return await this.userRepository.create({
      name,
      email,
      password,
    });
  }

  async createAdmin({ name, email, password }: CreateUserDto) {
    return await this.userRepository.create({
      name,
      email,
      password,
      role: "admin",
    });
  }

  async getAllUsers() {
    return this.userRepository
      .find({
        role: "user",
      });
  }

  async getAdmins() {
    return this.userRepository
      .find({
        role: "admin",
      });
  }

  async updateUser(id: string, data: any) {
    return this.userRepository.findByIdAndUpdate(id, data, {
      new: true,
    });
  }

  async deleteUser(id: string) {
    return this.userRepository.findByIdAndDelete(id);
  }

  async getUserById(id: string) {
    return this.userRepository.findById(id);
  }

  async getUserByEmail(email: string) {
    return this.userRepository.findOne({ email });
  }

}
