import UserModel from '../models/User.model';
const password = 'password';
// bcrypt hashpaassword
const hashedPassword =
  '$2a$10$0360tdqQ0pq1lVmtzZd0cuIcgJwAyPWO4AbzSoEz6wU1eC.0FJEpC';
const Users = [
  {
    name: 'John Doe',
    email: 'johndoe@yopmail.com',
    password: hashedPassword,
    role: 'admin',
  },
  {
    name: 'Jane Doe',
    email: 'jane@mailinator.com',
    password: hashedPassword,
  },
  {
    name: 'Alice',
    email: 'alice@mailinator.com',
    password: hashedPassword,
  },
];

export const seedUsers = async () => {
  // seed the users table with the data
  await UserModel.insertMany(Users);
  console.log('Users seeded successfully');
};
