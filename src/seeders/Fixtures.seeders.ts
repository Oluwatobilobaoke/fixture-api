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
  },
];

// seed the fixtures table with the data
export const seedFixtures = async () => {
  try {
    // get teams from the database
    let teams = await TeamModel.find({
      isDeleted: false,
    });

    // pick first 5 teams
    // teams = teams.slice(0, 10);

    const fixtures = [];
    let baseDate = 1759179224000; // Starting date in milliseconds

    for (let i = 0; i < teams.length - 1; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        const homeTeam = teams[i]._id;
        const awayTeam = teams[j]._id;

        const status = i % 2 === 0 ? 'pending' : 'completed';

        const fixture = {
          homeTeam,
          awayTeam,
          date: (baseDate += 1000).toString(),
          status,
          uniqueLink: `fixture-${homeTeam}-${awayTeam}-${baseDate}`,
          homeResult: '',
          awayResult: '',
        };

        // If status is "completed", add homeResult and awayResult
        if (status === 'completed') {
          fixture.homeResult = Math.floor(
            Math.random() * 5,
          ).toString(); // Random result between 0 and 4
          fixture.awayResult = Math.floor(
            Math.random() * 5,
          ).toString(); // Random result between 0 and 4
        }

        fixtures.push(fixture);
      }
    }

    await FixtureModel.insertMany(fixtures);
    console.log('Fixtures seeded successfully');
  } catch (error) {
    console.error('Error seeding fixtures', error);
  }
};
