import UserModel from '../models/User.model';

const Users = [
  {
    name: 'John Doe',
    email: 'johndoe@yopmail.com',
    password: 'password',
    role: 'admin',
  },
  {
    name: 'Jane Doe',
    email: 'jane@mailinator.com',
    password: 'password',
  },
  {
    name: 'Alice',
    email: 'alice@mailinator.com',
    password: 'password',
  },
];

export const seedUsers = async () => {
  // seed the users table with the data
  await UserModel.insertMany(Users);
  console.log('Users seeded successfully');
};
