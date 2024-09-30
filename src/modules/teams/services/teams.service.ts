import { Model } from 'mongoose';
import { ITeamModel } from '../../../models/Team.model';
import { CreateTeamDto, UpdateTeamDto } from '../dtos/TeamDto.dto';
import { getPagination } from '../../../library/pagination.utils';
import { AppError } from '../../../helpers';
import redisService from '../../../services/redisService';

export class TeamsService {
  constructor(private teamRepository: Model<ITeamModel>) {}

  async createTeam(payload: CreateTeamDto) {
    // check if team with name or nickname already exists
    const query: any = { $or: [{ name: payload.name }] };

    if (payload.nickname) {
      query.$or.push({ nickname: payload.nickname });
    }

    const teamExists = await this.teamRepository.findOne(query);

    if (teamExists) {
      throw new AppError(
        400,
        `Team with name ${payload.name} or nickname already exists`,
      );
    }
    const savedTeam = await this.teamRepository.create(payload);
    // create key for caching and save team data to cache
    const key = redisService.createKey('team', savedTeam._id);
    redisService.setCache(key, savedTeam);

    return savedTeam;
  }

  async getAllTeamss(req: any) {
    return this.teamRepository.find();
  }

  async getAllTeams(request: any) {
    const { search, skip = 0, limit = 10 } = request.query;
    const queryObject: any = { isDeleted: false };

    // Create a cache key based on the query parameters
    const cacheKey = redisService.createKey(
      'allTeams',
      JSON.stringify({ search, skip, limit }),
    );

    // Try to get data from cache
    const cachedData = await redisService.getCache(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    // If not in cache, perform the database query
    if (search) {
      queryObject.$or = [
        { name: { $regex: search, $options: 'i' } },
        { nickname: { $regex: search, $options: 'i' } },
      ];
    }

    const [teams, count] = await Promise.all([
      this.teamRepository
        .find(queryObject)
        .skip(Number(skip))
        .limit(Number(limit))
        .lean()
        .exec(),
      this.teamRepository.countDocuments(queryObject).exec(),
    ]);

    const pagination = getPagination(
      count,
      Number(skip),
      Number(limit),
    );

    const result = { teams, pagination };

    // Cache the result
    await redisService.setex(cacheKey, JSON.stringify(result), 300); // Cache for 5 min

    return result;
  }

  async getTeamById(id: string) {
    const key = redisService.createKey('team', id);
    let team = await redisService.getCache(key);

    if (team) {
      return JSON.parse(team);
    }

    team = await this.teamRepository.findOne({
      _id: id,
      isDeleted: false,
    });
    redisService.setCache(key, team);

    return team;
  }

  async updateTeam(id: string, data: UpdateTeamDto) {
    const team = await this.teamRepository.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
      },
    );

    // update team data in cache
    const key = redisService.createKey('team', id);
    redisService.setCache(key, team);
  }

  async deleteTeam(id: string) {
    await this.teamRepository.findByIdAndUpdate(id, {
      isDeleted: true,
      isDeletedAt: new Date(),
    });

    // delete team data from cache
    const key = redisService.createKey('team', id);
    redisService.del(key);
  }
}
