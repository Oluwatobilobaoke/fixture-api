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

export class FixturesService {
  constructor(private fixtureRepository: Model<IFixtureModel>) {}

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

    await this.fixtureRepository.create({
      homeTeam,
      awayTeam,
      date,
      uniqueLink: `${homeTeam}-${awayTeam}-${date}`,
    });
  }

  async getAllFixturess() {
    return this.fixtureRepository.find();
  }

  async getAllFixtures(request: any) {
    const queryObject: any = {
      isDeleted: false,
    };
    const search = request.query.search;
    const status = request?.query?.status;
    if (search !== undefined && search.length) {
      queryObject.$text = {
        $search: search,
      };
    }

    if (status !== undefined && status.length) {
      queryObject.status = status;
    }

    const skip = request.query.skip
      ? parseInt(request.query.skip)
      : 0;
    const limit = request.query.limit
      ? parseInt(request.query.limit)
      : 10;

    const fixtures = await this.fixtureRepository
      .find(queryObject)
      .populate(['homeTeam', 'awayTeam'])
      .skip(skip)
      .limit(limit)
      .exec();

    const count = await this.fixtureRepository
      .countDocuments(queryObject)
      .exec();

    const pagination = getPagination(count, skip, limit);

    return {
      fixtures: fixtures.map((fixtures) =>
        this.formatFixtureResponse(fixtures),
      ),
      pagination,
    };
  }

  async getFixtureById(id: string) {
    const fixture = await this.fixtureRepository
      .findOne({ _id: id, isDeleted: false })
      .populate(['homeTeam', 'awayTeam']);
    return this.formatFixtureResponse(fixture);
  }

  async updateFixture(id: string, data: UpdateFixtureDto) {
    // check date is part of data then check if it is in the past
    if (data?.date && isTimestampInPast(Number(data?.date)))
      throw new AppError(400, 'Date must be in the future');

    const fixture = await this.fixtureRepository
      .findByIdAndUpdate(id, data, {
        new: true,
      })
      .populate(['homeTeam', 'awayTeam']);

    return this.formatFixtureResponse(fixture);
  }

  async deleteFixture(id: string) {
    return this.fixtureRepository.findByIdAndUpdate(id, {
      isDeleted: true,
      isDeletedAt: new Date(),
    });
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
