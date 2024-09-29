import { NextFunction, Request, Response } from 'express';

import { TeamsService } from '../services/teams.service';
import Team from '../../../models/Team.model';
import { Logger } from '../../../library/Logger';
import { CreateTeamDto, UpdateTeamDto } from '../dtos/TeamDto.dto';

const teamService = new TeamsService(Team);

export class TeamsController {
  // create team
  static async addTeam(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const team: CreateTeamDto = await teamService.createTeam(
        req.body,
      );
      return res
        .status(201)
        .json({ message: 'Team created successfully', data: team });
    } catch (error) {
      Logger.error(error);

      next(error);
    }
  }

  // delete or remove team
  static async deleteTeam(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const team = await teamService.deleteTeam(req.params.id);
      return res
        .status(200)
        .json({ message: 'Team deleted successfully', data: team });
    } catch (error) {
      Logger.error(error);
      next(error);
    }
  }

  //edit team
  static async editTeam(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { id } = req.params;
      const payload: UpdateTeamDto = req.body;
      const product = await teamService.updateTeam(id, payload);
      return res.status(200).json({
        message: 'Team updated successfully',
        data: product,
      });
    } catch (error) {
      Logger.error(error);
      next(error);
    }
  }

  // get team by id
  static async getTeam(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { id } = req.params;
      const team = await teamService.getTeamById(id);
      return res
        .status(200)
        .json({ message: 'Team fetched successfully', data: team });
    } catch (error) {
      Logger.error(error);
      next(error);
    }
  }

  // get all teams
  static async getTeams(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const teams = await teamService.getAllTeams(req);
      return res
        .status(200)
        .json({ message: 'Teams fetched successfully', data: teams });
    } catch (error) {
      Logger.error(error);
      next(error);
    }
  }
}
