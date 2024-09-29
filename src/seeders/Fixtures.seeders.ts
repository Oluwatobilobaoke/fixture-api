import FixtureModel from '../models/Fixture.model';
import TeamModel from '../models/Team.model';

const fixtures = [
  {
    homeTeam: 'Manchester United',
    awayTeam: 'Arsenal',
    date: '1759179224000',
    status: 'pending',
    uniqueLink: `Manchester United-Arsenal-2021-09-30`,
  },
  {
    homeTeam: 'Chelsea',
    awayTeam: 'Liverpool',
    date: '1759159214000',
    status: 'completed',
    uniqueLink: `Chelsea-Liverpool-2021-09-30`,
    homeResult: '2',
    awayResult: '1',
  },
  {
    homeTeam: 'Manchester City',
    awayTeam: 'Tottenham Hotspur',
    date: '1759159214000',
    status: 'pending',
    uniqueLink: `Manchester-City-Tottenham-Hotspur-2021-09-30`,
  },
  {
    homeTeam: 'Everton',
    awayTeam: 'Leicester City',
    date: '1759159214000',
    status: 'pending',
    uniqueLink: `Everton-Leicester City-2021-09-30`,
  },
  {
    homeTeam: 'Leeds United',
    awayTeam: 'Aston Villa',
    date: '1759159214000',
    status: 'pending',
    uniqueLink: `Leeds United-Aston Villa-2021-09-30`,
  },
  {
    homeTeam: 'Newcastle United',
    awayTeam: 'West Ham United',
    date: '1759159214000',
    status: 'pending',
    uniqueLink: `Newcastle-United-West-Ham-United-2021-09-30`,
  },
  {
    homeTeam: 'Southampton',
    awayTeam: 'Crystal Palace',
    date: '1759159214000',
    status: 'completed',
    homeResult: '1',
    awayResult: '1',
    uniqueLink: `Southampton-Crystal-Palace-2021-09-30`,
  },
  {
    homeTeam: 'Wolverhampton Wanderers',
    awayTeam: 'Brighton & Hove Albion',
    date: '1759159214000',
    status: 'pending',
  }
]

// seed the fixtures table with the data
export const seedFixtures = async () => {
  try {
    // get teams from the database
    const teams = await TeamModel.find({
      isDeleted: false,
    });

    console.log('Teams', teams);
    // await FixtureModel.insertMany(fixtures);
    console.log('Fixtures seeded successfully');
  } catch (error) {
    console.error('Error seeding fixtures', error);
  }
}



