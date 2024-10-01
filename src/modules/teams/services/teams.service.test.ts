import { TeamsService } from './teams.service';
import { UpdateTeamType } from '../../../types';

describe('TeamsService', () => {
  // createTeam method creates a new team with given name, city, nickname, description
  it('should create a new team with given name, city, nickname, description', async () => {
    // @ts-ignore
    const createTeamDto = {
      name: 'Team Name',
      city: 'City Name',
      nickname: 'Nickname',
      description: 'Description',
    };

    const teamRepositoryMock = {
      findOne: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue(createTeamDto),
    };

    const teamsService = new TeamsService(teamRepositoryMock as any);

    await teamsService.createTeam(createTeamDto);
    expect(teamRepositoryMock.findOne).toHaveBeenCalledWith({
      $or: [
        { name: createTeamDto.name },
        { nickname: createTeamDto.nickname },
      ],
    });
    expect(teamRepositoryMock.create).toHaveBeenCalledWith(
      createTeamDto,
    );
  });

  // update team with given id and data successfully
  it('should update a team with given id and data', async () => {
    const id = '124';
    const data: UpdateTeamType = {
      name: 'Team Name',
      city: 'City Name',
      nickname: 'Nickname',
      description: 'Description',
    };

    const updatedTeam = {
      _id: id,
      ...data,
    };

    const teamRepositoryMock = {
      findByIdAndUpdate: jest.fn().mockResolvedValue(updatedTeam),
    };

    const teamsService = new TeamsService(teamRepositoryMock as any);

    await teamsService.updateTeam(id, data);
    expect(teamRepositoryMock.findByIdAndUpdate).toHaveBeenCalledWith(
      id,
      data,
      { new: true },
    );
  });

  // update a team with invalid id
  it('should throw an error when updating a team with invalid id', async () => {
    // Arrange
    const id = '123';
    const data: UpdateTeamType = {
      name: 'Updated Team Name',
      city: 'Updated City Name',
      nickname: 'Updated Nickname',
      description: 'Updated Description',
    };
    const teamRepositoryMock = {
      findByIdAndUpdate: jest
        .fn()
        .mockRejectedValue(new Error('Something went wrong')),
    };

    const teamsService = new TeamsService(teamRepositoryMock as any);

    // Act & Assert
    await expect(teamsService.updateTeam(id, data)).rejects.toThrow();
  });

  //delete a team with given id
  it('should delete a team with given id', async () => {
    const id = '123';

    const deletedTeam = null;
    const teamRepositoryMock = {
      findByIdAndUpdate: jest.fn().mockResolvedValue(deletedTeam),
    };

    const teamsService = new TeamsService(teamRepositoryMock as any);

    const result = await teamsService.deleteTeam(id);
    expect(teamRepositoryMock.findByIdAndUpdate).toHaveBeenCalled();
  });

  // get team by id
  it('should get team by id', async () => {
    const id = '123';

    const team = {
      _id: id,
      name: 'Team Name',
      city: 'City Name',
      nickname: 'Nickname',
      description: 'Description',
    };

    const teamRepositoryMock = {
      findOne: jest.fn().mockResolvedValue(team),
    };

    const teamsService = new TeamsService(teamRepositoryMock as any);

    const result = await teamsService.getTeamById(id);
    expect(result).toBe(team);
  });
});
