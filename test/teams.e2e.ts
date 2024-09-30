import request from 'supertest';
import mongoose from 'mongoose';
import { config } from '../src/config/config';
import { app } from '../src/server';
import User from '../src/models/User.model';
import Team from '../src/models/Team.model';

describe('Teams E2E Tests', () => {
  let adminToken: string;
  let teamIds: string[] = [];

  beforeAll(async () => {
    await mongoose.connect(config.mongo.url, {
      retryWrites: true,
      w: 'majority',
      dbName: config.mongo.dbNameTest,
    });
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Team.deleteMany({});
    await mongoose.connection.close();
  });

  it('should register an admin', async () => {
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
    expect(response.body.data).toHaveProperty('access_token');
    adminToken = response.body.data.access_token;
  });

  it('should create 3 teams', async () => {
    const teamNames = ['Team A', 'Team B', 'Team C', 'Team D'];
    for (const name of teamNames) {
      // Verify that the session contains the admin user
      const agent = request.agent(app);
      await agent.post('/api/v1/auth/login').send({
        email: 'admin@example.com',
        password: 'password123',
      });

      // Use the authenticated session to create a team
      const response = await agent
        .post('/api/v1/teams')
        .send({ name, city: `City of ${name}` });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Team created successfully');
      teamIds.push(response.body.data._id);
    }
    expect(teamIds.length).toBe(4);
  });

  it('should edit a team', async () => {
    const agent = request.agent(app);
    await agent.post('/api/v1/auth/login').send({
      email: 'admin@example.com',
      password: 'password123',
    });

    const response = await agent
      .patch(`/api/v1/teams/${teamIds[0]}`)
      .send({ name: 'Team A Updated' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Team updated successfully');
  });

  it('should remove a team', async () => {
    const agent = request.agent(app);
    await agent.post('/api/v1/auth/login').send({
      email: 'admin@example.com',
      password: 'password123',
    });

    const response = await agent.delete(
      `/api/v1/teams/${teamIds[1]}`,
    );

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Team deleted successfully');
  });

  it('should view a team', async () => {
    const agent = request.agent(app);
    await agent.post('/api/v1/auth/login').send({
      email: 'admin@example.com',
      password: 'password123',
    });

    const response = await agent.get(`/api/v1/teams/${teamIds[2]}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Team fetched successfully');
    expect(response.body.data).toHaveProperty('name', 'Team C');
  });
});
