import request from 'supertest';
import mongoose from 'mongoose';
import { config } from '../src/config/config';
import { app } from '../src/server';
import User from '../src/models/User.model';

describe('Auth E2E Tests', () => {
  beforeAll(async () => {
    await mongoose.connect(config.mongo.url, {
      retryWrites: true,
      w: 'majority',
      dbName: config.mongo.dbNameTest,
    });
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  it('should create an admin', async () => {
    const response = await request(app)
      .post('/api/v1/auth/register/admins')
      .send({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Admin created successfully');
  });

  it('should login as admin', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User logged in successfully');
    expect(response.headers['set-cookie']).toBeDefined();
  });

  it('should logout admin', async () => {
    const agent = request.agent(app);
    await agent.post('/api/v1/auth/login').send({
      email: 'admin@example.com',
      password: 'password123',
    });

    const response = await agent.post('/api/v1/auth/logout');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Logout successful');
  });

  it('should create a user', async () => {
    const response = await request(app)
      .post('/api/v1/auth/register/users')
      .send({
        name: 'Regular User',
        email: 'user@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User created successfully');
  });

  it('should login as user', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'user@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User logged in successfully');
    expect(response.headers['set-cookie']).toBeDefined();
  });

  it('should logout user', async () => {
    const agent = request.agent(app);
    await agent.post('/api/v1/auth/login').send({
      email: 'user@example.com',
      password: 'password123',
    });

    const response = await agent.post('/api/v1/auth/logout');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Logout successful');
  });
});
