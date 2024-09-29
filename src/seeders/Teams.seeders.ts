import TeamModel from '../models/Team.model';

const teams = [
  {
    name: 'Arsenal',
    city: 'London',
  },
  {
    name: 'Chelsea',
    city: 'London',

  },
  {
    name: 'Manchester United',

    city: 'London',

  },
  {
    name: 'Liverpool',

    city: 'London',

  },
  {
    name: 'Manchester City',

    city: 'London',

  },
  {
    name: 'Tottenham Hotspur',

    city: 'London',

  },
  {
    name: 'Leicester City',

    city: 'London',

  },
  {
    name: 'Everton',

    city: 'London',

  },
  {
    name: 'West Ham United',

    city: 'London',

  },
  {
    name: 'Aston Villa',

    city: 'London',
  },
  {
    name: 'Newcastle United',

    city: 'London',
  },
  {
    name: 'Southampton',
    city: 'London',
  },
  {
    name: 'Crystal Palace',
    city: 'London',
  },
  {
    name: 'Wolverhampton Wanderers',
    city: 'London',
  },
  {
    name: 'Brighton & Hove Albion',

    city: 'London',
  },
  {
    name: 'Fulham',

    city: 'London',
  },
  {
    name: 'Burnley',

    city: 'London',
  },
  {
    name: 'Sheffield United',

    city: 'London',
  },
  {
    name: 'West Bromwich Albion',

    city: 'London',
  }
]

// seed the teams table with the data
export const seedTeams = async () => {
  try {
    await TeamModel.insertMany(teams);
    console.log('Teams seeded successfully');
  } catch (error) {
    console.error('Error seeding teams');
    console.error(error);
  }
}