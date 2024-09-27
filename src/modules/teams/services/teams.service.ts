import { Model } from 'mongoose';
import { ITeamModel } from '../../../models/Team.model';
import { CreateTeamDto, UpdateTeamDto } from '../dtos/TeamDto.dto';
import { getPagination } from '../../../library/pagination.utils';
import { AppError } from '../../../helpers';

export class TeamsService {
  constructor(private teamRepository: Model<ITeamModel>) {}

  async createTeam({
    name,
    city,
    nickname,
    description,
  }: CreateTeamDto) {
    // check if team with name or nickname already exists
    const teamExists = await this.teamRepository.findOne({
      $or: [{ name }, { nickname }],
    });

    if (teamExists) {
      throw new AppError(
        400,
        `Team with name ${name} or nickname ${nickname} already exists`,
      );
    }

    return await this.teamRepository.create({
      name,
      city,
      nickname,
      description,
    });
  }

  async getAllTeamss(req: any) {
    return this.teamRepository.find();
  }

  async getAllTeams(request: any) {
    const queryObject: any = {
      isDeleted: false,
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

    const teams = await this.teamRepository
      .find(queryObject)
      .skip(skip)
      .limit(limit)
      .exec();

    const count = await this.teamRepository
      .countDocuments(queryObject)
      .exec();

    const pagination = getPagination(count, skip, limit);

    return {
      teams,
      pagination,
    };
  }

  async getTeamById(id: string) {
    return this.teamRepository.findOne({ _id: id, isDeleted: false });
  }

  async updateTeam(id: string, data: UpdateTeamDto) {
    return this.teamRepository.findByIdAndUpdate(id, data, {
      new: true,
    });
  }

  async deleteTeam(id: string) {
    return this.teamRepository.findByIdAndUpdate(id, {
      isDeleted: true,
      isDeletedAt: new Date(),
    });
  }
}
