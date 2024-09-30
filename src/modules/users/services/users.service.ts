import { Model } from 'mongoose';
import { IUserModel } from '../../../models/User.model';
import { CreateUserDto } from '../dtos/CreateUserDto.dto';
import { getPagination } from '../../../library/pagination.utils';
import { IGeT } from '../../common/interface';
import redisService from '../../../services/redisService';

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
      role: 'admin',
    });
  }

  async getAllUsers() {
    return this.userRepository.find({
      role: 'user',
    });
  }

  async getAdmins(request: any) {
    const queryObject: any = {
      role: 'admin',
    };
    const search = request.query.search;
    if (search !== undefined && search.length) {
      queryObject.$text = {
        $search: search,
      };
    }

    const skip = request.query.skip
      ? parseInt(request.query.skip)
      : 0;
    const limit = request.query.limit
      ? parseInt(request.query.limit)
      : 10;

    // Fetch users with pagination
    const users = await this.userRepository
      .find(queryObject)
      .skip(skip)
      .limit(limit)
      .exec();

    // Count the total documents matching the query
    const count = await this.userRepository
      .countDocuments(queryObject)
      .exec();

    const pagination = getPagination(count, skip, limit);

    return {
      users,
      pagination,
    };
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
    return this.userRepository.findOne({ _id: id, isDeleted: false });
  }

  async getUserByEmail(email: string) {
    return this.userRepository.findOne({ email });
  }
}
