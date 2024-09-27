import { Model } from 'mongoose';
import { IFixture, IFixtureModel } from '../../../models/Fixture.model';
import {
  CreateFixtureDto,
  UpdateFixtureDto,
} from '../dtos/FixtureDto.dto';
import { AppError } from '../../../helpers';
import { getPagination } from '../../../library/pagination.utils';
import { isTimestampInPast } from '../../../library/date.utils';

export class FixtureService {
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
    const fixtureExists = await this.fixtureRepository.findOne({
      $or: [{ homeTeam }, { awayTeam }, { date }],
    });

    if (fixtureExists)
      throw new AppError(
        400,
        `Fixture with homeTeam ${homeTeam} or awayTeam ${awayTeam} on that exact date ${date} already exists`,
      );


    return await this.fixtureRepository.create({
      homeTeam,
      awayTeam,
      date,
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

    const fixtures = await this.fixtureRepository
      .find(queryObject)
      .skip(skip)
      .limit(limit)
      .exec();

    const count = await this.fixtureRepository
      .countDocuments(queryObject)
      .exec();

    const pagination = getPagination(count, skip, limit);

    return {
      fixtures,
      pagination,
    };
  }

  async getFixtureById(id: string) {
    return this.fixtureRepository.findOne({ _id: id, isDeleted: false });
  }

  async updateFixture(id: string, data: UpdateFixtureDto) {
    // check date is part of data then check if it is in the past
    if (data?.date && isTimestampInPast(Number(data?.date)))
      throw new AppError(400, 'Date must be in the future');

    return this.fixtureRepository.findByIdAndUpdate(id, data, {
      new: true,
    });
  }

  async deleteFixture(id: string) {
    return this.fixtureRepository.findByIdAndUpdate(id, {
      isDeleted: true,
      isDeletedAt: new Date(),
    });
  }
}
