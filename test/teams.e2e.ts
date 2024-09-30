import request from 'supertest';
import mongoose from 'mongoose';
import { config } from '../src/config/config';
import { app } from '../src/server';
import User from '../src/models/User.model';
import Team from '../src/models/Team.model';
import Fixture from '../src/models/Fixture.model';

import { Express } from 'express';


async function makeAuthenticatedAgent(
  app: Express,
  email: string,
  password: string,
) {
  const agent = request.agent(app);
  await agent.post('/api/v1/auth/login').send({ email, password });
  return agent;
}
describe('Teams E2E Tests', () => {
  let adminAgent: request.SuperAgentTest;
  let userAgent: request.SuperAgentTest;
  let teamIds: string[] = [];

  beforeAll(async () => {
    await mongoose.connect(config.mongo.url, {
      retryWrites: true,
      w: 'majority',
      dbName: config.mongo.dbNameTest,
    });

        // Register admin user
    await request(app).post('/api/v1/auth/register/admins').send({
      name: 'Admin User',
      email: 'adminteam@example.com',
      password: 'password123',
    });

    // Register regular user
    await request(app).post('/api/v1/auth/register/users').send({
      name: 'Regular User',
      email: 'userteam@example.com',
      password: 'password123',
    });

    // Create authenticated agents
    //@ts-ignore
    adminAgent = (await makeAuthenticatedAgent(
      app,
      'adminteam@example.com',
      'password123',
    ));
    //@ts-ignore
    userAgent = (await makeAuthenticatedAgent(
      app,
      'userteam@example.com',
      'password123',
    ));
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Team.deleteMany({});
    await Fixture.deleteMany({});
    await mongoose.connection.close();
  });

  it('Admin should create 3 teams', async () => {
    const teamNames = ['Team A', 'Team B', 'Team C', 'Team D'];
    for (const name of teamNames) {
        
      // Use the authenticated session to create a team
      const response = await adminAgent
        .post('/api/v1/teams')
        .send({ name, city: `City of ${name}` });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Team created successfully');
      teamIds.push(response.body.data._id);
    }
    expect(teamIds.length).toBe(4);
  });

  it('Adminshould edit a team', async () => {
   
    const response = await adminAgent
      .patch(`/api/v1/teams/${teamIds[0]}`)
      .send({ name: 'Team A Updated' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Team updated successfully');
  });

  it('Admin should remove a team', async () => {
   
    const response = await adminAgent.delete(
      `/api/v1/teams/${teamIds[1]}`,
    );

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Team deleted successfully');
  });

  it('Admin should view a team', async () => {
   
    const response = await adminAgent.get(`/api/v1/teams/${teamIds[2]}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Team fetched successfully');
    expect(response.body.data).toHaveProperty('name', 'Team C');
  });

  it('User should view teams', async () => {
   
    const response = await userAgent.get(`/api/v1/teams`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Teams fetched successfully');
  });

  it('User should view team', async () => {
   
    const response = await userAgent.get(`/api/v1/teams/${teamIds[0]}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Team fetched successfully');
  });



  
});
