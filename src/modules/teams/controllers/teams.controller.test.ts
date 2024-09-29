import { TeamsService } from '../services/teams.service';
import Team from '../../../models/Team.model';
import { TeamsController } from './teams.controller';


// const teamService = new TeamsService(Team); //

jest.mock("../services/teams.service");

describe("TeamsController", () => {
  // create team
  it("should create a new team and return a 201 status code", async () => {
    const req = {
      body: {
        name: "Team Name",
        city: "City Name",
        nickname: "Nickname",
        description: "Description",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    // @ts-ignore
    await TeamsController.addTeam(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });

  // delete team
  it("should delete a team", async () => {
    const req = {
      params: {
        id: "123",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();
    // @ts-ignore
    await TeamsController.deleteTeam(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  // edit team
  it("should edit a team", async () => {
    const req = {
      params: {
        id: "123",
      },
      body: {
        name: "Team Name",
        city: "City Name",
        nickname: "Nickname",
        description: "Description",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    // @ts-ignore
    await TeamsController.editTeam(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  // get team by id
  it("should get a team by id", async () => {
    const req = {
      params: {
        id: "123",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    // @ts-ignore
    await TeamsController.getTeam(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

});
