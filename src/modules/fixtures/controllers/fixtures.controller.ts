import { NextFunction, Request, Response } from 'express';
import { Logger } from '../../../library/Logger';
import { FixtureService } from '../services/fixtures.service';
import { UpdateFixtureDto } from '../dtos/FixtureDto.dto';
import Fixture from '../../../models/Fixture.model';

const fixtureService = new FixtureService(Fixture);

export class FixturesController {
  static async addFixture(
    req: Request,
    res: Response,
    next: NextFunction,
  ){
    try {
      const fixture = await fixtureService.createFixture(req.body);
      return res
        .status(201)
        .json({ message: 'Fixture created successfully', data: fixture });
    } catch (error) {
      Logger.error(error);
      next(error);
    }
  }

  static async deleteFixture(
    req: Request,
    res: Response,
    next: NextFunction,
  ){
    try {
      const { id } = req.params;
      const fixture = await fixtureService.deleteFixture(id);
      return res
        .status(200)
        .json({ message: 'Fixture deleted successfully', data: fixture });
    } catch (error) {
      Logger.error(error);
      next(error);
    }
  }

  //edit fixture
  static async editFixture(
    req: Request,
    res: Response,
    next: NextFunction,
  ){
    try {
      const { id } = req.params;
      const payload: UpdateFixtureDto = req.body;
      const fixture = await fixtureService.updateFixture(id, payload);
      return res.status(200).json({
        message: 'Fixture updated successfully',
        data: fixture,
      });
    } catch (error) {
      Logger.error(error);
      next(error);
    }
  }

  // get fixture
  static async getFixture(
    req: Request,
    res: Response,
    next: NextFunction,
  ){
    try {
      const { id } = req.params;
      const fixture = await fixtureService.getFixtureById(id);
      return res.status(200).json({
        message: 'Fixture fetched successfully',
        data: fixture,
      });
    } catch (error) {
      Logger.error(error);
      next(error);
    }
  }

  //get fixtures
  static async getFixtures(
    req: Request,
    res: Response,
    next: NextFunction,
  ){
    try {
      const fixtures = await fixtureService.getAllFixtures(req);
      return res.status(200).json({
        message: 'Fixtures fetched successfully',
        data: fixtures,
      });
    } catch (error) {
      Logger.error(error);
      next(error);
    }
  }
}