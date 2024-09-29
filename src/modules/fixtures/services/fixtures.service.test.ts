
import { FixturesService } from './fixtures.service';
import { CreateFixtureType } from '../../../types';

describe('FixturesService', () => {
  // createFixture method creates a new fixture with given data
  it('should create a new fixture with given data', async () => {
    const createFixtureDto: CreateFixtureType = {
      homeTeam: 'Home Team',
      awayTeam: 'Away Team',
      date: '1790559965000',
    };

    const fixtureRepositoryMock = {
      findOne: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue(createFixtureDto),
    };

    const fixturesService = new FixturesService(fixtureRepositoryMock as any);

    await fixturesService.createFixture(createFixtureDto);
    expect(fixtureRepositoryMock.findOne).toHaveBeenCalledWith({
      $or: [{ homeTeam: createFixtureDto.homeTeam }, { awayTeam: createFixtureDto.awayTeam }, { date: createFixtureDto.date }],
    });
    expect(fixtureRepositoryMock.create).toHaveBeenCalledWith(createFixtureDto);
  });

// update fixture with given id and data successfully
  it('should update a fixture with given id and data', async () => {
    const id = '124'
    const data: CreateFixtureType = {
      homeTeam: 'Home Team',
      awayTeam: 'Away Team',
      date: '1790559965000',
    };

    const updatedFixture = {
      _id: id,
      ...data,
    }

    const fixtureRepositoryMock = {
      findByIdAndUpdate: jest.fn().mockResolvedValue(updatedFixture),
    };

    const fixturesService = new FixturesService(fixtureRepositoryMock as any);

    await fixturesService.updateFixture(id, data);
    expect(fixtureRepositoryMock.findByIdAndUpdate).toHaveBeenCalledWith(id, data,  { new: true });
  });

  // update a fixture with invalid id
  it('should throw an error if id is invalid', async () => {
    const id = '124'
    const data: CreateFixtureType = {
      homeTeam: 'Home Team',
      awayTeam: 'Away Team',
      date: '1790559965000',
    };

    const fixtureRepositoryMock = {
      findByIdAndUpdate: jest
        .fn()
        .mockRejectedValue(new Error("Something went wrong")),
    };

    const fixturesService = new FixturesService(fixtureRepositoryMock as any);

    await expect(fixturesService.updateFixture(id, data)).rejects.toThrow();
  });

  // delete fixture with given id
  it('should delete a fixture with given id', async () => {
    const id = '124'

    const deletedFixture = null

    const fixtureRepositoryMock = {
      findByIdAndUpdate: jest.fn().mockResolvedValue(deletedFixture),
    };

    const fixturesService = new FixturesService(fixtureRepositoryMock as any);

    const result = await fixturesService.deleteFixture(id);
    expect(result).toBeNull();
  });


  // getFixtureById method returns a fixture with given id
  it('should return a fixture with given id', async () => {
    const id = '124'

    const fixture = {
      _id: id,
      homeTeam: 'Home Team',
      awayTeam: 'Away Team',
      date: '1790559965000',
    }

    const fixtureRepositoryMock = {
      findOne: jest.fn().mockResolvedValue(fixture),
    };

    const fixturesService = new FixturesService(fixtureRepositoryMock as any);

    const result = await fixturesService.getFixtureById(id);
    expect(result).toBe(fixture);

  });

});