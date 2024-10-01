import { Model } from 'mongoose';
import {
  IFixture,
  IFixtureModel,
} from '../../../models/Fixture.model';
import {
  CreateFixtureDto,
  UpdateFixtureDto,
} from '../dtos/FixtureDto.dto';
import { AppError } from '../../../helpers';
import { getPagination } from '../../../library/pagination.utils';
import {
  isTimestampInPast,
  timestampToDate,
} from '../../../library/date.utils';
import redisService from '../../../services/redisService';
import { Types } from 'mongoose';
import { ITeamModel } from '../../../models/Team.model';

export class FixturesService {
  constructor(
    private fixtureRepository: Model<IFixtureModel>,
    private teamRepository: Model<ITeamModel>,
  ) {}

  async createFixture({
    homeTeam,
    awayTeam,
    date,
  }: CreateFixtureDto) {
    // validate date
    if (isTimestampInPast(Number(date)))
      throw new AppError(400, 'Date must be in the future');

    // check if fixture with homeTeam or awayTeam on that exact date already exists

    // The homeTeam matches and the date matches, OR
    //  The awayTeam matches and the date matches.

    const fixtureExists = await this.fixtureRepository.findOne({
      $or: [
        { homeTeam, date },
        { awayTeam, date },
      ],
    });

    // const fixtureExists = await this.fixtureRepository.findOne({
    //   date,
    //   $or: [{ homeTeam }, { awayTeam }],
    // });

    if (fixtureExists)
      throw new AppError(
        400,
        `Fixture with homeTeam ${homeTeam} or awayTeam ${awayTeam} on that exact date ${date} already exists`,
      );

    const fixture = await this.fixtureRepository.create({
      homeTeam,
      awayTeam,
      date,
      uniqueLink: `${homeTeam}-${awayTeam}-${date}`,
    });

    const key = redisService.createKey('fixture', fixture._id);
    redisService.setCache(key, fixture);

    return fixture;
  }

  async getAllFixturess() {
    return this.fixtureRepository.find();
  }

  async getAllFixtures(request: any) {
    const cacheKey = this.generateCacheKey(request.query);
    let cachedData = await redisService.getCache(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const queryObject: any = {
      isDeleted: false,
    };
    const { search, status, skip = 0, limit = 10 } = request.query;

    if (search !== undefined && search.length) {
      // First, search for teams matching the search term
      const matchingTeams = await this.teamRepository
        .find({
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { nickname: { $regex: search, $options: 'i' } }, // Add this line
          ],
        })
        .select('_id');

      const teamIds = matchingTeams.map((team) => team._id);

      queryObject.$or = [
        { homeTeam: { $in: teamIds } },
        { awayTeam: { $in: teamIds } },
        { date: { $regex: search, $options: 'i' } },
        { status: { $regex: search, $options: 'i' } },
        { uniqueLink: { $regex: search, $options: 'i' } },
      ];
    }

    if (status !== undefined && status.length) {
      queryObject.status = status;
    }

    const fixtures = await this.fixtureRepository
      .find(queryObject)
      .populate(['homeTeam', 'awayTeam'])
      .skip(Number(skip))
      .limit(Number(limit))
      .exec();

    const count = await this.fixtureRepository
      .countDocuments(queryObject)
      .exec();

    const pagination = getPagination(
      count,
      Number(skip),
      Number(limit),
    );

    const result = {
      fixtures: fixtures.map((fixture) =>
        this.formatFixtureResponse(fixture),
      ),
      pagination,
    };

    // Cache for 5 minutes
    await redisService.setex(cacheKey, result, 300);

    return result;
  }

  async getAllFixtures(request: any) {
    const cacheKey = this.generateCacheKey(request.query);
    let cachedData = await redisService.getCache(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const queryObject: any = {
      isDeleted: false,
    };

    const {
      search,
      status,
      skip = 0,
      limit = 10,
      startDate,
      endDate,
    } = request.query;

    // Handle full-text search for team names and nicknames
    if (search !== undefined && search.length) {
      const matchingTeams = await this.teamRepository
        .find({
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { nickname: { $regex: search, $options: 'i' } },
          ],
        })
        .select('_id');

      const teamIds = matchingTeams.map((team) => team._id);

      queryObject.$or = [
        { homeTeam: { $in: teamIds } },
        { awayTeam: { $in: teamIds } },
        { status: { $regex: search, $options: 'i' } },
        { uniqueLink: { $regex: search, $options: 'i' } },
      ];
    }

    // Handle date range search
    if (startDate && endDate) {
      queryObject.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (startDate) {
      queryObject.date = {
        $gte: new Date(startDate),
      };
    } else if (endDate) {
      queryObject.date = {
        $lte: new Date(endDate),
      };
    }

    // Handle status filter
    if (status !== undefined && status.length) {
      queryObject.status = status;
    }

    const fixtures = await this.fixtureRepository
      .find(queryObject)
      .populate(['homeTeam', 'awayTeam'])
      .skip(Number(skip))
      .limit(Number(limit))
      .exec();

    const count = await this.fixtureRepository
      .countDocuments(queryObject)
      .exec();

    const pagination = getPagination(
      count,
      Number(skip),
      Number(limit),
    );

    const result = {
      fixtures: fixtures.map((fixture) =>
        this.formatFixtureResponse(fixture),
      ),
      pagination,
    };

    // Cache for 5 minutes
    await redisService.setex(cacheKey, result, 300);

    return result;
  }
  async getFixtureById(id: string) {
    const key = redisService.createKey('fixture', id);
    let cacheFixture = await redisService.getCache(key);

    if (cacheFixture) {
      return JSON.parse(cacheFixture);
    }

    const fixture = await this.fixtureRepository
      .findOne({ _id: id, isDeleted: false })
      .populate(['homeTeam', 'awayTeam']);

    if (fixture) {
      redisService.setCache(key, this.formatFixtureResponse(fixture));
    }
    return this.formatFixtureResponse(fixture);
  }

  async updateFixture(id: string, data: UpdateFixtureDto) {
    const key = redisService.createKey('fixture', id);

    // check date is part of data then check if it is in the past
    if (data?.date && isTimestampInPast(Number(data?.date)))
      throw new AppError(400, 'Date must be in the future');

    const fixture = await this.fixtureRepository
      .findByIdAndUpdate(id, data, {
        new: true,
      })
      .populate(['homeTeam', 'awayTeam']);

    redisService.setCache(key, this.formatFixtureResponse(fixture));

    return this.formatFixtureResponse(fixture);
  }

  async deleteFixture(id: string) {
    const key = redisService.createKey('fixture', id);
    redisService.del(key);

    return this.fixtureRepository.findByIdAndUpdate(id, {
      isDeleted: true,
      isDeletedAt: new Date(),
    });
  }

  private generateCacheKey(queryParams: any): string {
    const { search, status, skip, limit, ...otherParams } =
      queryParams;
    const sortedParams = Object.keys(otherParams)
      .sort()
      .reduce(
        (obj, key) => {
          obj[key] = otherParams[key];
          return obj;
        },
        {} as Record<string, any>,
      );

    return redisService.createKey(
      'all_fixtures',
      JSON.stringify({
        search: search || '',
        status: status || '',
        skip: skip || 0,
        limit: limit || 10,
        ...sortedParams,
      }),
    );
  }

  formatFixtureResponse(fixture: any) {
    return {
      _id: fixture?._id,
      homeTeam: {
        name: fixture?.homeTeam?.name ?? '',
        _id: fixture?.homeTeam?._id ?? '',
      },
      awayTeam: {
        name: fixture?.awayTeam?.name ?? '',
        _id: fixture?.awayTeam?._id ?? '',
      },
      date: fixture?.date ?? '',
      homeResult: fixture?.homeResult ?? '',
      awayResult: fixture?.awayResult ?? '',
      status: fixture?.status ?? '',
      uniqueLink: fixture?.uniqueLink ?? '',
    };
  }
}
