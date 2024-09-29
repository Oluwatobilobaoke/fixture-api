import mongoose from 'mongoose';
import { config } from '../config/config';
import { Logger } from '../library/Logger';
import { seedTeams } from './Teams.seeders';
import { seedFixtures } from './Fixtures.seeders';
import { seedUsers } from './Users.seeders';

export const seeders = async () => {
  // connect to database with mongoose
  const database = await mongoose
    .connect(config.mongo.url, {
      retryWrites: true,
      w: 'majority',
      dbName: 'fixture-api-db',
    })
    .then(async () => {
      console.log('MongoDB connected for seeders');
      await mongoose.connection.db.dropDatabase();
    })
    .catch((error) => {
      Logger.error('MongoDB connection for seeder error');
      Logger.error(error);
    });

  console.log('Running seeders...');

  await seedTeams();
  await seedUsers();
  await seedFixtures();

  console.log('Seeders run successfully');
};

seeders()
  .then((r) => {})
  .catch((e) => console.error(e));

// exit

