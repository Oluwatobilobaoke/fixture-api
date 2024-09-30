import request from 'supertest';
import mongoose from 'mongoose';
import { config } from '../src/config/config';
import { app } from '../src/server';
import User from '../src/models/User.model';

describe('Users Controller', () => {
  beforeAll(async () => {
    await mongoose.connect(config.mongo.url, {
      retryWrites: true,
      w: 'majority',
      dbName: config.mongo.dbNameTest,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // await User.deleteMany({});
  });

  // describe('GET /users', () => {
  //   it('should return all users', async () => {

  //     const response = await request(app).get('/users');

  //     expect(response.status).toBe(200);
  //     expect(response.body.message).toBe('Users fetched successfully');
  //     // expect(response.body.data).toHaveLength(2);
  //     expect(response.body.data[0]).toHaveProperty('name', 'email');
  //   });
  // });

  // describe('GET /users/admins', () => {
  //   it('should return all admin users', async () => {

  //     const response = await request(app).get('/users/admins');

  //     expect(response.status).toBe(200);
  //     expect(response.body.message).toBe('Admins fetched successfully');
  //     expect(response.body.data).toHaveLength(2);
  //     expect(response.body.data[0]).toHaveProperty('username', 'admin1');
  //     expect(response.body.data[1]).toHaveProperty('username', 'admin2');
  //   });
  // });
});
