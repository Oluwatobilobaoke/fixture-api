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
      dbName: config.mongo.dbName,
    })
    .then(async () => {
      console.log('MongoDB connected for seeders');
      //@ts-ignore
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

// start seeders and exit
seeders()
  .then(() => {
    console.log('Seeders completed. Exiting...');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error running seeders:', error);
    process.exit(1);
  });
